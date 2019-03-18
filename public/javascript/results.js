function configureChart(election){
	var ctx = document.getElementById(election._id);
	var parties = {partyIds:[],partyNames:[],partyColours:[],partyVotes:[]};
	elections._candidates.forEach(function(candidate){
	});
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels:  parties.partyNames,
	        datasets: [{
	            label: '# of Votes',
	            data: parties.votes,
	            backgroundColor: parties.partyColours,
	            borderColor:  parties.partyColours,
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
