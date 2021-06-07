function f_print() {
    var initBody = document.body.innerHTML;
    window.onbeforeprint = function () {
        // print_area는 인쇄하고자 하는 영역의 ID를 말합니다.( 필수 )
        document.body.innerHTML = document.getElementById("print_area").innerHTML;
    }
    window.onafterprint = function () {
        document.body.innerHTML = initBody;
    }
    window.print();
}