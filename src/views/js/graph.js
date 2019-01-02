const  graph = (function(){
    'use strict';
    function generate(){
      const context = document.getElementById("myChart").getContext("2d"),
            data = {
              labels: ['Read', 'To read'],
              datasets: [{
                  label:'Reading progress:',
                  data: [0, 100],
                  backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)'
                  ]
              }],
              labels: [
                  'read',
                  'to-read',
              ]
          }

      return  new Chart(context, {
        type: 'doughnut',
        data: data,

        borderWidth: 1,
        options:{  
          legend: {
            labels: {
                fontColor: "white",
                fontSize: 14
            }
          }
        }
      })
    }

    function update(index, totalWords){
      // console.log([totalWords - (index+1), totalWords])
      preogressChart.data.datasets[0].data = [(index+1), totalWords - (index+1)]
      preogressChart.update()
    }

    const preogressChart = generate();

    return {
      generate,
      update,
      preogressChart
    }
  })();