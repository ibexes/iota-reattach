var IOTA = require('iota.lib.js');

// Create IOTA instance with host and port as provider
var iota = new IOTA({
	'host': 'https://iotanode.us',
	'port': 443
});

//enable this if you want to do PoW client side
//var curl = require('curl.lib.js');
//curl.overrideAttachToTangle(iotaHandle.api);
const depth = 3;
const minWeightMagnitude = 14;
if(process.argv.length<3){
    console.log("please enter bundle");
    process.exit(1);
}
var bundle=[process.argv[2]];

iota.api.findTransactionObjects({'bundles':bundle}, function(error,success){
    if (error) {
        console.error(error);
    } else {
        //get tail tx
        for(var i = 0; i < success.length; i++) {
            var tx = success[i];
            if(tx.currentIndex===0){
                //console.log(tx.hash);
                iota.api.isReattachable(tx.hash, function(err,isReattachable){
                    console.log(isReattachable);
                    if(isReattachable){
                        iota.api.replayBundle(tx.hash, depth, minWeightMagnitude, function(e,s){
                            if(e){
                                console.error(e);
                            }else{
                                //console.log(s);
                                console.log("success!");
                            }
                        });
                    }else{
                        console.error("already confirmed");
                        //console.error(isReattachable);
                    }
                });
                
                break;
            }
        }
    }
});

if(false){
    //promotions, work in progress
iota.api.findTransactionObjects({'bundles':['B9F9EYOJHEAQ9RGETQGOOHIKX99VBFTARKFHWWZAXUBHGTLEZJT9EHPCCFQJWUHEDHTANPHKFSTRIBBPA']}, function(error,success){
    if (error) {
        console.error(error);
    } else {
        //get tail tx
        for(var i = 0; i < success.length; i++) {
            var tx = success[i];
            if(tx.currentIndex===0){
                console.log(tx.hash +": "+ i);
               
                params={"delay":0,"interrupt":false};
                iota.api.promoteTransaction(tx.hash, depth, minWeightMagnitude, [{ address: '9'.repeat(81), value: 0, message: '', tag: '' }],params, function(e,s){
                        if(e){
                            //console.error("error promoting");
                            //console.error(e);
                            if (e.message.indexOf('Inconsistent subtangle') > -1) {
                                console.error("oh well");
                                
                            }
                            console.error(e);
                        } else {
                            //console.log(s);
                            console.log("success!");
                        }
                });
            }
        }
    }
});
}
