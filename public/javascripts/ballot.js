$("#btn_vote").click(function(e){
    e.preventDefault();
    var candidate = $("input[name='candidate']:checked").val();

    $.ajax({
        method: "POST",
        data: candidate,
        url: '/',
        success: function(data){
            alert(data.message);
        },
        error: function(data){
            alert(data.message);
        }
    });
});