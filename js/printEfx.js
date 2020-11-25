 
function w3_open() {
  document.getElementById("ss__top__burger__bar").style.marginLeft = "180px";
  document.getElementById("mySidebar").style.width = "100%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
  document.getElementById("ss__top__burger__bar").style.marginLeft = "0";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}

$(document).ready(function () {
  $('select').selectize({
      sortField: 'text'
  });
}); 

// function myFunction() {
//   alert('jkjk');
//   document.getElementById("myDIV").style.position = "fixed";
// }
