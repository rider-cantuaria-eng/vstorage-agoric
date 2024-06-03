import { Far, makeMarshal } from '@endo/marshal';

const convertSlotToVal = (slot, iface) => {
  if (!iface) {
    return '???';
  }
  
  return Far(iface, {
    getIface: () => iface.replace('Alleged: ', ''),
  });
};
  
const { unserialize } = makeMarshal(undefined, convertSlotToVal);

export default unserialize;