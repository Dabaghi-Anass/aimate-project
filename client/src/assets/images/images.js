import body from "../frames/body_frame.png";
import happy from "../frames/happy_frame1.png";
import sad from "../frames/sad_frame1.png";
import mad from "../frames/mad_frame1.png";
import love from "../frames/love_frame.png";
import loading from "../frames/loading_frame.png";
function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

let ha = createImage(happy);
let s = createImage(sad);
let m = createImage(mad);
let l = createImage(love);
let la = createImage(loading);
let bd = createImage(body);
let reactions = {
  happy: ha,
  sad: s,
  mad: m,
  love: l,
  loading: la,
  body: bd,
};

export default reactions;
