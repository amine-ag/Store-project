let a = () => {
  console.log('function A !');
}

let b = () => {
  console.log('function B !');
}

let pr = () => {
  new Promise((resolve, reject)=>{
    resolve('this is resolve !');
    reject('error');
  }).then(res=>{
    console.log(res);
  }).catch(err => console.log(err))
  
}



let call = () =>{
  a();
  pr();
  process.nextTick(pr);
  b();
}

call();