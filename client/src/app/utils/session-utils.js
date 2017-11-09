export function formatTime(time){

  let str = time

  if(str.indexOf(",") == -1){
    let b = str.split(" ")
    str = [b[0], ", ", b[1], " " + b[2]].join("")
  }

  return str;
}

