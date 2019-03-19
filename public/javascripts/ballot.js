$('[name="candidate"]').click(function(){
    var candidate_id = $("input[name='candidate']:checked").val();
    $('#votingFor').val(candidate_id);
})

$("#btn_vote").click(function(){
    var candidate_id = $("input[name='candidate']:checked").val();
    alert("You have voted for: " + $('#'+candidate_id+'_name').val());
});