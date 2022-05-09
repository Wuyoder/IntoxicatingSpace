function worker() {
  var timer = -performance.now();
  const workerGo = async () => {
    setTimeout(() => {
      timer += performance.now();
      console.log('Test Time 3sec: ' + (timer / 1000).toFixed(5) + ' sec.');
    }, 3000);
  };
  workerGo();
}
worker();
