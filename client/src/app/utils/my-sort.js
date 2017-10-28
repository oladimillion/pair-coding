function getTime(time){
  return new Date(time).getTime();
}

export function MySort(){
  return (cItem, nItem)  => { 
    return getTime(cItem.time) > getTime(nItem.time) ? -1 : 
      getTime(cItem.time) < getTime(nItem.time) ? 1 : 0 }
}
