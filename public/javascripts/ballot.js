$("#btn_vote").click(function(e){
    e.preventDefault();
    console.log("You have voted for: ");
    var candidate_id = $("input[name='candidate']:checked").val();

    $.ajax({
        method: "POST",
        data: {
            vote: candidate_id
        },
        url: 'ballot/cast_vote',
        success: function(data){
            location.reload(true);
            location.replace("./ballot/vote_msg?msg=confirmed");
        },
        error: function(data){
            location.reload(true);
            location.replace("./ballot/vote_msg?msg=error");
        }
    });
});