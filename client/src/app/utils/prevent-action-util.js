export function PreventAction(isloading, func){
  // prevents modal window from being closed by the user if request is processing
  if(isloading)
    return;

  func();
}
