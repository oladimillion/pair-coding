$(document).ready(
    function() {
        alignRight();
        alignLeft();
        // alignJustify();
    }
);

//align right
function alignRight() {
    var padding = $(".right");
    padding.attr("align", "right");
}

//align left
function alignLeft() {
    var padding = $(".left");
    padding.attr("align", "left");
}

//align justify
function alignJustify() {
    var padding = $(".justify");
    padding.attr("align", "justify");
}