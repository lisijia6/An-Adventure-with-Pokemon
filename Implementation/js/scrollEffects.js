// **********  fullPage  ********** //
var myFullpage = new fullpage('#fullpage', {
    navigation: true,
    navigationPosition: 'right',


    onLeave: function(origin, destination, direction) {
        var origId = origin.item.getAttribute('id');
        var destId = destination.item.getAttribute('id');


        // if(origId === "title-sec") {
        //     // show map section when user scrolls beyond title page (this is to prevent stack-loading in first page!)
        //     $('#map-container').css("display", "inline");
        // }

        // // color navigation dots accordingly
        // if(origId == 'mcu-intro-sec' || origId == 'map-sec' || origId == 'future-sec') {
        //     $('#fp-nav ul li a span').removeClass('bright-navdots');
        //
        // };
        // if(destId == 'mcu-intro-sec' || destId == 'map-sec' || destId == 'future-sec') {
        //     $('#fp-nav ul li a span').addClass('bright-navdots');
        // };

    },


    afterLoad: function(origin, destination, direction) {
        var secId = destination.item.getAttribute('id');


        switch (secId) {
            case 'boxOffice-sec':
                boxOffice.wrangleData();
                break;
            case 'cluster-sec':
                pokeCluster.wrangleData(0);
                break;
            case 'map-sec':
                pokemonGoMapVis.wrangleData();
                break;
            case 'comparison-sec':
                pokemonCompareVis1.wrangleData();
                pokemonCompareVis2.wrangleData();
                // if (!plotVis.drawn) {
                //     drawPlotVis();
                // }
                break;

            // case 'characters-sec':
            //     if (!doneIntro) {
            //         charactersIntro();
            //     }
            //     break;
            // case 'network-intro-vis':
            //     drawNetworkIntroVis();
            //     break;
            // case 'network-vis':
            //     drawNetworkVis();
            //     break;
        }
    }
});

