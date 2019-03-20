/** @module Results Schema */

/**
 * Function to configure the charts to show the election's results
 * @name configureChart
 * @param election{JSON} A JSON object created in the Election Model to describe what the chart needs to show
 * @callback configureChart
 */
function configureChart(election){
	console.log("Configure Chart");
    console.log(election);
    //Gets the canvas from the document
	var ctx = document.getElementById(election.id);
    //Canvas stylings
    ctx.width  = 400;
    ctx.height = 300; 
    ctx.style.width  = '800px';
    ctx.style.height = '600px';

    //Configures the chart with the relevant information from the election variable
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
