/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

  function show() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var link = dots.innerHTML;
    if (link === "...") {
        dots.innerHTML = "Show less";
        moreText.style.display = "inline";
    } else {
        dots.innerHTML = "...";
        moreText.style.display = "none";
    }
  }

function showAchievement() {
    $('#dlcCollapse').collapse('hide');
    $('#achievementCollapse').collapse('show');
}

function showDLC() {
    $('#achievementCollapse').collapse('hide');
    $('#dlcCollapse').collapse('show');
}
