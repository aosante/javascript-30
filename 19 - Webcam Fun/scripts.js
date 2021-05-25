const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = _ => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => console.log('Oh Noooo', err));
};

const paintToCanvas = _ => {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //take pixels out of the image
    let pixels = ctx.getImageData(0, 0, width, height);
    //mess with the pixels

    // pixels = redEffect(pixels);
    // pixels = ctx.rgbSplit(pixels);
    // ctx.globalAlpha = 0.2;
    pixels = greenScreen(pixels);

    //putting pixels back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
};

const takePhoto = _ => {
  //plays the snapshot sound
  snap.currentTime = 0;
  snap.play();
  //take the data out of canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src=${data} alt="handsome man"/>`;
  strip.insertBefore(link, strip.firstChild);
};

const redEffect = pixels => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.7; //blue
  }
  return pixels;
};

const rgbSplit = pixels => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i + 500] = pixels.data[i + 1]; //green
    pixels.data[i - 500] = pixels.data[i + 2]; //blue
  }
  return pixels;
};

const greenScreen = pixels => {
  //holds the min and maximum green
  const levels = {};

  document.querySelector('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
};

// getVideo();
video.addEventListener('canplay', paintToCanvas);
