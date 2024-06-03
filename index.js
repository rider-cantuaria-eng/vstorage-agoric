import './config/installSesLockdown.js';
import unserialize from './viewer.js';

const loadAbciQuery = async (node, subPath = '', dataMode = false, height) => {
  try{

    const mode = dataMode ? 'data' : 'children';
    
    // legacy mode
    const options = {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'abci_query',
        params: { 
          path: '/custom/vstorage/' + mode + '/' + subPath, 
          height: height && height.toString()
        },
      }),
    };

    console.log('>>> Options body:', options.body);
    
    const res = await fetch(node, options);
    const vResponse = (await res.json()).result.response;    
    
    if(vResponse.value){
      const parsedValue = JSON.parse(atob(vResponse.value));
  
      if(!dataMode) {
        if(parsedValue.children.length) {
          console.log('>>> ' + parsedValue.children.length + ' Children');
          console.log(parsedValue.children)          
        } else {
          console.warn('>>> No children');
        }

        console.warn('Now trying data...');
        loadAbciQuery(node, subPath, true);
        return;
      }

      //show data      
      const values = JSON.parse(parsedValue.value).values;      
      values.map(v => {
        const m = unserialize(JSON.parse(v));
        console.log(Object.keys(m));
        console.log(m);
      });
      
    } else{
      console.log('>>> No value');
      console.log(vResponse.log);
    }

    }
  catch(e){
    console.log(e);
  }
};

const rcps = {
  agoric :{
    mainA: 'https://main-a.rpc.agoric.net',
    main: 'https://main.rpc.agoric.net',
  },
  polkachu: {
    main:'https://agoric-rpc.polkachu.com/'
  },
}
  
loadAbciQuery(rcps.agoric.mainA, 'published.wallet');