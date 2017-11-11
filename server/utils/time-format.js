
function formatTimeToGMT(time = Date.now())
{
  const timeZone = new Date().getTimezoneOffset();
  return (time - (timeZone  * 60000));
}

function formatTimeToLocale(time)
{
  const timeZone = new Date().getTimezoneOffset();
  return (time + (timeZone  * 60000));
}


module.exports = {
  formatTimeToGMT,
  formatTimeToLocale,
}




        // time: new Date().toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric", hour12: true})
