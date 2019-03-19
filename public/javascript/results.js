function configureChart(election){
	console.log("Configure Chart");
    console.log(election);
	var ctx = document.getElementById(election.id);
    ctx.width  = 400;
    ctx.height = 300; 
    ctx.style.width  = '800px';
    ctx.style.height = '600px';
	var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: election.partyNames,
        datasets: [{
            label: '# of Votes',
            data: election.partyVotes,
            backgroundColor: election.partyColours,
            borderColor: election.partyColours,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}
