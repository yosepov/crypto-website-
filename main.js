(() => {
    ($(() => {

        /////validations
        let coinsBoxIndex = 0;
        let aboutBoxIndex = 0;
        let reportsBoxIndex = 0;
        let stopButton = 0;
        let replaceIndex = 1;

        $("#playChartLoading").css("display", "none");
        $("#loadingCoinsBox").css("display", "none");
        $("#loadingAboutBox").css("display", "none");
        $("#loadingReportBox").css("display", "none");
        $("#aboutBox").css("display", "none");
        $("#coinsBox").css("display", "");
        $("#reportsBox").css("display", "none");
        $("#reportsChart").css("display", "none");


////////////reports array//////////
        let reports = new Array();
        arrayReset();

        function arrayReset() {



            reports = [];

            for (let i = 0; i < localStorage.length; i++) {

                if (localStorage.key(i) != null && localStorage.key(i) != undefined && localStorage.key(i) != "reports") {
                    let report = localStorage.key(i);
                    let stringReports = JSON.stringify(localStorage.getItem(report));
                    reports.push(stringReports);
                }

            }
            let reportString = JSON.stringify(reports);
            localStorage.setItem("reports", reportString);
            $("#reportsCount").empty().html("Reports:" + (reports.length) + "/5");
            $("#loadingReportCounting").css("display","none");
        }







        ///////////////////// Nav Bar //////////////////////
        const navSlide = () => {
            const burger = document.querySelector(`.burger`);
            const nav = document.querySelector(`.nav-links`);
            const navLinks = document.querySelectorAll(`.nav-links li`);

            //toggle nav bar
            burger.addEventListener(`click`, () => {
                nav.classList.toggle(`nav-active`);

                //animate links nav bar
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = "";
                    } else {
                        link.style.animation = `navLinkFrame 0.5 ease forwards ${index / 7 + 0.3}s`;
                    }
                });
            });
        }
        navSlide();

        //////////////coins list api//////////////////////
        function getCoinsApi() {
            return new Promise((resolve, reject) => {
                $.getJSON("https://api.coingecko.com/api/v3/coins/list", coins => {
                    resolve(coins);
                }).fail(err => reject(err));
            })
        }

        ////////////////////coins info api//////////////////////
        function getCoinsInfoApi(id) {
            return new Promise((resolve, reject) => {
                $.getJSON(`https://api.coingecko.com/api/v3/coins/${id}`, coins => {
                    resolve(coins);
                }).fail(err => reject(err));
            })
        }

        ///////////////show coins information function///////////////////
        function showCoinsInfo(id) {
            getCoinsInfoApi(id).then(info => {
                $(`#loading${id}`).css("display", "none");
                $(`#${id}Info`).append(`
                <image src="${info.image.small}"> <br>
                <p>USD: ${info.market_data.current_price.usd}$<br>
                EUR: ${info.market_data.current_price.eur}€<br>
                ILS: ${info.market_data.current_price.ils}₪<br></p>`)
            });
        }

        ///////////new main cards////////////////
        function showAllCoins() {
            getCoinsApi().then(coins => {
                for (let i = 0; i < 100; i++) {
                    let id = coins[i].id;
                    let name = coins[i].name;
                    let symbol = coins[i].symbol;

                    ///api bug fixed////
                    if (coins[i].name != "Academy Token") {

                        /////// html card ////////////
                        let card = `<div id="${id}" class="card">
                    <p class="nameCard">${name}<br>${symbol}</p>
                    <button id="${id}InfoButton" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#${id}InfoDiv" aria-expanded="false" aria-controls="${coins[i].id}InfoDiv">
                    More Info
                    </button>

                    <button id="${id}ToggleOff" class="toggleOn">Add Coin To Reports</button>
                    <button id="${id}ToggleOn" class="toggleOff">Remove Coin From Reports</button>

                    <button id="${id}ModalButton" type="button" aria-placeholder="Will Remove within 2 seconds"  class="btn btn-primary" data-toggle="modal" data-target="#modal">
                    Click Here To Replace This Coin
                  </button>

                <div class="collapse" id="${id}InfoDiv">
                  <div class="loading" id="${id}Info" class="card card-body">
                  <img width="100px"  id="loading${id}"  src="/assets/pictures/loading.gif">
                  </div>
                </div>         
                 </di>`

                        //////Create New Card
                        createNewCards(card);
                        $(`#${id}ModalButton`).css("display", "none");

                        //validations toggles//////////
                        if (localStorage.getItem(`Report${id}`) != null) {
                            $(`#${id}ToggleOff`).css("display", "none");
                            $(`#${id}ToggleOn`).css("display", "");
                        } else {
                            $(`#${id}ToggleOff`).css("display", "");
                            $(`#${id}ToggleOn`).css("display", "none");
                        }
                        toggleEvents(id, coins[i]);

                        //////more info button
                        let validation = 0;
                        $(`#${id}InfoButton`).click(() => {
                            if (validation === 0) {
                                $(`#loading${id}`).css("display", "")
                                showCoinsInfo(id);
                                validation = 1;
                                setTimeout(() => {
                                    $(`#${id}Info`).empty();
                                    return validation = 0;
                                }, 120000);
                            } else {
                                return;
                            }
                        });

                        for (let i = 0; i < reports.length; i++) {
                            if (reports[i] === coins[0]) {
                            }
                        }

                        ////////////////////modals
                        $(`#saveChanges`).click(() => {
                            $(`#modalBody`).empty();
                        });
                        $(`#${id}ModalButton`).click(() => {
                            for (let i = 0; i < localStorage.length; i++) {
                                if (localStorage.key(i) != undefined && localStorage.key(i) != null && localStorage.key(i) != NaN && localStorage.key(i) != "reports" != "") {
                                    let key = localStorage.key(i);
                                    let coin = localStorage.getItem(key);
                                    let parseCoin = JSON.parse(coin);
                                    let replace = ` 
<p class="nameModal"><image src="${parseCoin.image.small}"><br>Name:${parseCoin.name}<br>Symbol: ${parseCoin.symbol}<br>USD: ${parseCoin.market_data.current_price.usd}
<br>EUR: ${parseCoin.market_data.current_price.eur}
<br>ILS: ${parseCoin.market_data.current_price.ils}<br>
<button id="${parseCoin.id}Replace" class="modalReplaceButton">Remove <span>${parseCoin.id}</span> from reports</button></p>`

                                    $(`#modalBody`).append(replace);
                                    $(`#${parseCoin.id}Replace`).click(() => {
                                        if(replaceIndex != 1){
                                            return alert("You can replace one currency at a time");
                                        }

                                        replaceIndex = 0;
                                        removeReportsList(parseCoin.id);
                                        addReportsList(id);
                                        $(`#${parseCoin.id}Replace`).css("background-color", "rgb(81, 255, 0)");
                                        $(`#${parseCoin.id}Replace`).css("border", "2px solid white");
                                        $(`#${parseCoin.id}Replace`).html("Removed & Replaced Done!");

                                        $(`#${id}ToggleOff`).css("display", "none");
                                        $(`#${id}ToggleOn`).css("display", "");

                                        $(`#${parseCoin.id}ToggleOn`).css("display", "none");
                                        $(`#${parseCoin.id}ToggleOff`).css("display", "");
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        /////show card auto when reload home page
        showAllCoins();

        ////////////////// creat new search card/////////////////
        function createSearchCard() {

            ////validations/////
            let coinId = $(`#searchInput`).val();
            $(`#searchInput`).val("");
            if (coinId === "") {
                alert("Please Enter a crypto currnecy ID:");
                return;
            }
            getCoinsInfoApi(coinId).then(coins => {
                let id = coins.id;
                let name = coins.name;
                let symbol = coins.symbol;

                /////// html card ////////////
                let card = `<div id="${id}" class="card">
<p class="nameCard">${name}<br>${symbol}</p>
<button id="${id}InfoButton" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#${id}InfoDiv" aria-expanded="false" aria-controls="${id}InfoDiv">
More Info
</button>
<button id="${id}ToggleOff" class="toggleOn">Add Coin Reports</button>
<button id="${id}ToggleOn" class="toggleOff">Remove Coin From Reports</button>

<button  id="${id}ModalButton" type="button"  class="btn btn-primary" data-toggle="modal" data-target="#modal">
Click Here To Replace This Coin
</button>

<div class="collapse" id="${id}InfoDiv">
<div class="loading" id="${id}Info" class="card card-body">
<img width="100px"  id="loading${id}"  src="/assets/pictures/loading.gif">
</div>
</div>
</di>`

                $("#coinsBox").append(card);
                $("#aboutBox").css("display", "none");
                $("#reportsBox").css("display", "none");
                $(`#${id}ModalButton`).css("display", "none");

                //validations toggles//////////
                if (localStorage.getItem(`Report${id}`) != null) {
                    $(`#${id}ToggleOff`).css("display", "none");
                    $(`#${id}ToggleOn`).css("display", "");
                } else {
                    $(`#${id}ToggleOff`).css("display", "");
                    $(`#${id}ToggleOn`).css("display", "none");
                }
                toggleEvents(id, coins);

                //////more info button
                let validation = 0;
                $(`#${id}InfoButton`).click(() => {
                    if (validation === 0) {
                        $(`#loading${id}`).css("display", "")
                        showCoinsInfo(id);
                        validation = 1;
                        setTimeout(() => {
                            $(`#${id}Info`).empty();
                            return validation = 0;
                        }, 120000);
                    } else {
                        return;
                    }
                });



                $(`#${id}ModalButton`).click(() => {
                    for (let i = 0; i < localStorage.length; i++) {
                        if (localStorage.key(i) != undefined && localStorage.key(i) != null && localStorage.key(i) != NaN && localStorage.key(i) != "reports" != "") {
                            let key = localStorage.key(i);
                            let coin = localStorage.getItem(key);
                            let parseCoin = JSON.parse(coin);
                            let replace = ` 
<p class="nameModal">${parseCoin.name}<br>${parseCoin.symbol}</p>
<button id="${parseCoin.id}Replace" class="modalReplaceButton">Remove <span>${parseCoin.id}</span> from reports</button>`
                            $(`#modalBody`).append(replace);
                            $(`#${parseCoin.id}Replace`).click(() => {
                                if(replaceIndex != 1){
                                    return alert("You can replace one currency at a time");
                                }
                                replaceIndex = 0;
                                removeReportsList(parseCoin.id);
                                addReportsList(id);
                                $(`#${parseCoin.id}Replace`).css("background-color", "green");
                                $(`#${parseCoin.id}Replace`).html("Removed & Replaced - Done!");

                                $(`#${id}ToggleOff`).css("display", "none");
                                $(`#${id}ToggleOn`).css("display", "");

                                $(`#${parseCoin.id}ToggleOn`).css("display", "none");
                                $(`#${parseCoin.id}ToggleOff`).css("display", "");
                            });
                        }
                    }
                });
            }).catch(() => alert("can't find this ID, try again:"));
        }
        $("#searchButton").click(() => {
            $("#reportsChart").css("display", "none");
            $("#reportsBox").css("display", "none");
            $("#coinsBox").css("display", "");
            $("#coinsBox").empty();
            $("header").css("display", "none");
            createSearchCard();
        })


        //////////links functions //////////////////
        $("#coinsLink").click(() => {
            $("#coinsBox").empty().css("display", "");
            $("#aboutBox").css("display", "none");
            $("#reportsBox").css("display", "none");
            $("#loadingCoinsBox").css("display", "");
            $("#loadingReportBox").css("display", "none");
            $("#loadingAboutBox").css("display", "none");
            $("#reportsChart").css("display", "none");
            $("header").css("display", "");
            coinsBoxIndex = 1;
            aboutBoxIndex = 0;
            reportsBoxIndex = 0;
            showAllCoins();
        })

        $("#aboutLink").click(() => {
            coinsBoxIndex = 0;
            aboutBoxIndex = 1;
            reportsBoxIndex = 0;
            $("#coinsBox").css("display", "none");
            $("#reportsBox").css("display", "none");
            $("#reportsChart").css("display", "none");
            $("#aboutBox").css("display", "");
            $("#loadingCoinsBox").css("display", "none");
            $("#loadingReportBox").css("display", "none");
            $("#loadingAboutBox").css("display", "");
            $("header").css("display", "none");
            setTimeout(() => $("#loadingAboutBox").css("display", "none"), 1000)
        })

        $("#reportsLink").click(() => {
            reportsBoxIndex = 1;
            coinsBoxIndex = 0;
            aboutBoxIndex = 0;
            if (reportsBoxIndex === 1) {
                stopButton = 1;
                removeData(chart);
            }
            $("#reportsBox").css("display", "");
            $("#aboutBox").css("display", "none");
            $("#coinsBox").css("display", "none");
            $("#loadingCoinsBox").css("display", "none");
            $("#loadingReportBox").css("display", "");
            $("#loadingAboutBox").css("display", "none");
            $("#reportsChart").css("display", "");
            $("header").css("display", "none");
        })







        /////////add report to list function////////////

        function addReportsList(id) {
            getCoinsInfoApi(id).then(coin => {
                reports.push(coin);
                index = reports.indexOf(coin);
                let coinString = JSON.stringify(coin);
                localStorage.removeItem("reports");
                localStorage.setItem("reports", reports);
                localStorage.setItem(`Report${coin.id}`, coinString);
                arrayReset();
            }).catch();
        }

        //////remove report list /////////
        function removeReportsList(id) {
            getCoinsInfoApi(id).then(coin => {
                reports.slice(coin);
                let coinString = JSON.stringify(coin);
                localStorage.removeItem("reports");
                localStorage.setItem("reports", reports);
                localStorage.removeItem(`Report${coin.id}`, coinString);
                arrayReset();
            }).catch();
        }

        /////////////////////////////////create card function//////////////
        function createNewCards(card) {
            ///////////////////card create////////////
            $("#loadingCoinsBox").css("display", "none")
            $("#coinsBox").append(card);
        }
        ///////////////////////////////////////////



        /////events Toggle//////////
        function toggleEvents(id) {
            $(`#${id}ToggleOff`).click(() => {
                $("#loadingReportCounting").css("display","");
                if (reports.length >= 5) {
                    $(`#${id}ToggleOn`).css("display", "none");
                    $(`#${id}ToggleOff`).css("display", "none");
                    $(`#${id}ModalButton`).css("display", "");
                    setTimeout(() => {
                        $(`#${id}ModalButton`).css("display", "none");
                        $(`#${id}ToggleOff`).css("display", "");
                    }, 1500)

                    $(`#saveChanges`).click(() => {
                        replaceIndex = 1;
                        $(`#${id}ModalButton`).css("display", "none");
                    });
                    return;
                }
                addReportsList(id);
                $(`#${id}ToggleOff`).css("display", "none");
                $(`#${id}ToggleOn`).css("display", "");
            });

            $(`#${id}ToggleOn`).click(() => {
                $("#loadingReportCounting").css("display","");
                removeReportsList(id);
                $(`#${id}ToggleOn`).css("display", "none");
                $(`#${id}ToggleOff`).css("display", "");
            });

            ///////////////

        }



        //////////////////////reports chart/////////////////
        const reportsChart = document.getElementById('reportsChart').getContext('2d');
        const chart = new Chart(reportsChart, {


        //////type of chart
            type: 'line',
            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: [],
                    backgroundColor: 'red',
                    fill: false,
                    borderColor: 'red',
                    data: []
                }, {
                    label: [],
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    data: []
                }, {
                    label: [],
                    fill: false,
                    backgroundColor: 'purple',
                    borderColor: 'purple',
                    data: []
                }, {
                    label: [],
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: []
                }, {
                    label: [],
                    fill: false,
                    backgroundColor: 'orange',
                    borderColor: 'orange',
                    data: []
                }]
            },

        });

        function updateChartPrices() {
            let intervalChart = setInterval(() => {
                

/////////////////validations/////////
                if (coinsBoxIndex === 1) {
                    return;
                } else if (aboutBoxIndex === 1) {
                    return;
                }



                for (let i = 0; i < localStorage.length; i++) {

                    if (localStorage.key(i) != undefined && localStorage.key(i) != null && localStorage.key(i) != NaN && localStorage.key(i) != "reports" != "") {

                        let key = localStorage.key(i);
                        let coin = localStorage.getItem(key);
                        let parseCoin = JSON.parse(coin);



                        getCoinsInfoApi(parseCoin.id).then(coin => {
                            let date = new Date();
                            let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                            addData(chart, coin.market_data.current_price.usd, i, time, coin.name);
                            
                            $("#playChartLoading").css("display", "none");
                            $("#stopChartButton").click(() => {
                                stopButton = 1;
                                clearInterval(intervalChart);
                            })
                        });

                        if (reportsBoxIndex === 0) {
                            clearInterval(intervalChart);
                        }
                    }
                }

            }, 2000);
        }


        function addData(chart, price, index, time, name) {
            $("#loadingReportBox").css("display", "none");
            $("#playChartLoading").css("display", "none");
            if (chart.data.datasets[index].data === undefined || chart.data.datasets[index].data === null) {
                return;
            }
            chart.data.datasets[index].data.push(price);
            chart.data.datasets[index].label.pop();
            chart.data.datasets[index].label.push(name);
            if (index === 0) {
                chart.data.labels.push(time);
            }
            chart.update({
                duration: 300,
                easing: 'easeOutBounce'
            });
        }

        function removeData(chart) {
            chart.data.labels = [];
            chart.data.datasets.forEach((dataset) => {
                dataset.data = [];
            });
            chart.update();
        }

        ///// clear and restart chart button
        $("#clearChartButton").click(() => {
            if (stopButton === 1) {
                removeData(chart);
                stopButton = 1;
            } else {
                alert("You need to stop the chart first.");
            }

        });

                ///// start and restart chart button
                $("#startChartButton").click(() => {
                    if (stopButton === 1) {
                        $("#playChartLoading").css("display", "");
                        updateChartPrices();
                        stopButton = 0;
                    } else {
                        alert("You need to stop the chart first.");
                    }
        
                });

        $("#reportsCount").click(()=>{

                     for (let i = 0; i < localStorage.length; i++) {

                        if (localStorage.key(i) != undefined && localStorage.key(i) != null && localStorage.key(i) != NaN && localStorage.key(i) != "reports" != "") {

                            let key = localStorage.key(i);
                            let coin = localStorage.getItem(key);
                            let parseCoin = JSON.parse(coin);

                            let cryptoCoin = ` 
            
<p class="nameModal"><image src="${parseCoin.image.small}"> <br>Name:${parseCoin.name}<br>Symbol: ${parseCoin.symbol}<br>ID: ${parseCoin.id}<br>USD: ${parseCoin.market_data.current_price.usd}
<br>EUR: ${parseCoin.market_data.current_price.eur}
<br>ILS: ${parseCoin.market_data.current_price.ils}<br></p>`


    $(`#modalBody`).append(cryptoCoin);      


                        }
                        
                    }
                });
    }))
})();