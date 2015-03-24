  var modalMap;
  var service;
  var longitude;
  var latitude;
  var totalLocations = new Array();
  var totalLocationNames = new Array();
  var totalLocationDistances = new Array();
  var callCount = 0;
  var currLat;
  var currLong;
  var mapUrl;
  var tableDesc;
  var isDetails = false;
  var userLocation;
  var currOpenPlace;
  var isMobile = { 
    Android: function() { return navigator.userAgent.match(/Android/i); }, 
    BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
    Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
    Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
    any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
  function clickModal(){
    $("#firstData > *, #secondData > *, #thirdData > *").click(function()
    {
      
      var myservice;
      $('#myModal').modal({
        keyboard: true
      });
      tableDesc = $(this).children();
      //console.log(tableDesc);
      for(var i = 0; i < totalLocations.length; i++)
      {
        if(totalLocations[i].distance == tableDesc[2].innerHTML)
        {
          currLat = totalLocations[i].geometry.location.k;
          currLong = totalLocations[i].geometry.location.D;
          
          }
        }
    //location from array of total locations to instantiate map. 
    var restLocation = new google.maps.LatLng(currLat, currLong);
    //finding average latitutde and longitute for map center
    var centerLocation = new google.maps.LatLng((currLat + latitude)/2, (currLong + longitude)/2);
    modalMap = new google.maps.Map(document.getElementById('rowDesc'),{
          center: centerLocation,
          zoom: 15
        });
    var marker = new google.maps.Marker({ 
      position: restLocation,
      map: modalMap
    });
     
     var origMarker = new google.maps.Marker({ 
      position: userLocation,
      map: modalMap
    });
    

    document.getElementById("rowName").innerHTML = tableDesc[0].innerHTML;
    
  function resizeMap() {
   if(typeof modalMap =="undefined") return;
   setTimeout( function(){resizingMap();} , 400);
}

function resizingMap() {
   
   var center = modalMap.getCenter();
   google.maps.event.trigger(modalMap, "resize");
   modalMap.setCenter(center); 
    }
  });


}

/*STARTS here man*/
$(document).ready(function(){
    
  //instantiation of arrow back to top
  $('.selectpicker').selectpicker();

  $(document).ready(function() {
  $("#dataTable").tablesorter({
    sortList: [[0,0]],     
    cssAsc: 'headerSortUp',   
    cssDesc: 'headerSortDown', 
    cssHeader: 'header',
    widgets : ['stickyHeaders','reflow'],
    widgetOptions : {
    stickyHeaders_attachTo : '.table-responsive',
    reflow_className    : 'ui-table-reflow',
    reflow_dataAttrib : 'data-title'
      
  }
  });
});

    document.getElementById("name").onclick = function(){
    document.getElementById("click").innerHTML = "Restaurants currently open sorted by name";
  }  
    document.getElementById("rating").onclick = function(){
    document.getElementById("click").innerHTML = "Restaurants currently open sorted by rating";
  }
    document.getElementById("distance").onclick = function(){
    document.getElementById("click").innerHTML = "Restaurants currently open sorted by distance";
  }

  if(navigator.geolocation == undefined)
    {
      document.getElementById("click").innerHTML = "Could not retrieve your current location";
      document.getElementById("mobile").innerHTML = "Try enabling geolocation in your browser";
    }
  else 
    {
    
    navigator.geolocation.getCurrentPosition(success, error);
    }
  });

function changeSearch(){

  $('.fa-arrow-up').click(function () {
  $('html,body').animate({scrollTop: 0}, 500);
    return false;
  });
  }
  function success(position)
  {
    /*latitude and longitude contain the users current location. */
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    //console.log("my latitude "+ latitude);
    //console.log("my longitude "+ longitude);
    initialize();
  }
  function error()
  {
    document.getElementById("click").innerHTML = "Could not retrieve your current location";
    document.getElementById("mobile").innerHTML = "Try enabling location services on your device.";
  }

  function initialize() 
  {
      itemCount = 0;
      userLocation = new google.maps.LatLng(latitude,longitude);
      var request = 
        {
          /*don't be a dummy tallahassee is a variable name, but its not that anymore, but you want this to be here forever */
          location: userLocation,
          radius: '12000',
          types: ['restaurant'],
          openNow: true 
        };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);   
  }

function callback(results, status, info) 
  {
    
    if(info.hasNextPage === true) 
        {
          info.nextPage();
        }
        //~ Use this whenever you want to see what args you're getting.
        //console.log("Got arguments", arguments);
        
      if (status == google.maps.places.PlacesServiceStatus.OK) 
        {
         callCount +=1;
         parseLocations(results,callCount,info);
        }
        
  }
  function parseReviews()
  {
    
    var service; 
    isDetails = true;
    for(var i = 0; i < totalLocations.length; i++)
    {
      if(tableDesc[2].innerHTML == totalLocations[i].distance)
      {
        //var id = "'"+totalLocations[i].place_id + "'";
        var request = 
        {
          placeId: totalLocations[i].place_id
        };
      service = new google.maps.places.PlacesService(map);
      service.getDetails(request,setReviewModal)
      }
  }
}

  function setReviewModal(results,status,info)
  {
    console.log(results);
    $("#headreview").show();
    document.getElementById('bodyreview').innerHTML = "";
    document.getElementById('headreview').innerHTML = "<tr><th>" + "Author" + "</th>" + "<th>" + "Experience" + "</th>" + "<th>" + "Rating / 5" + "</th>" + "</tr>";
    var allReviews = $.extend(true, [], results);
    

    for(var i = 0; i < results.reviews.length; i++)
    {
      //console.log("allReviews Before: " + allReviews[i].text);
      if(results.reviews[i].text.length < 5 )break;
      if(results.reviews[i].text.length > 100)
        results.reviews[i].text = results.reviews[i].text.substr(0,100);
      //console.log("allReviews After: " + allReviews[i].text);
      document.getElementById('bodyreview').innerHTML += "<tr class=\"reviewrows\">" + "<td class=\"reviewauthor\">" + results.reviews[i].author_name + "</td>" +  "<td class=\"reviewtext\">" + results.reviews[i].text + "...." + "</td>" 
      + "<td class=\"reviewrating\">" + results.reviews[i].rating  + "</td>" + "</tr>"; 

    }
     
    flip(false);
    moreInfo(allReviews);
  }
  
  function moreInfo(allResults)
  {
    
    $(".reviewrows").click(function(){

      //clicked results object is the children of the tr, so the author text and rating td's 
      var clickedResult = $(this).children();
      for(var i=0; i < allResults.reviews.length; i++)
      {
        if (allResults.reviews[i].author_name == clickedResult[0].innerHTML )
        {
          $("#headreview").hide();
          document.getElementById('bodyreview').innerHTML = allResults.reviews[i].text;
          
        }
      }
    });
  }

  function parseLocations(locations,callCount,info)
  {
    //this attaches a back to top event when the up arrow is pressed.
    
    changeSearch();
    var counter = 0;
    if (callCount == 2)
    {
        counter = 20;
    }
    else if (callCount == 3)
    {
      counter = 40;
    }
    //console.log("call count" + counter);
    //~ Use this whenever you want to display object/array arguments.
    //var tBody = ["firstData","secondData","thirdData"];
    var currentDistances = calculateDistance(locations,latitude,longitude);
    for (var i = 0; i < locations.length; i++, counter++)
        { 
          var distanceandDescription = undefined;
          totalLocations[counter] = locations[i];
          totalLocationNames[counter] =locations[i].name;
          var x = $.inArray(locations[i].name,totalLocationNames,0);
          if(x > -1 && x != counter)
          {
            //if (locations[x].vicinity.length == 0 && locations[i].vicinity.length == 0) break; 
            locations[i].vicinity = locations[i].vicinity.replace(/[0-9#]/g, '');
            locations[i].vicinity = locations[i].vicinity.substr(0,locations[i].vicinity.indexOf(','));
            distanceandDescription = currentDistances[i].toFixed(2) + "(" + locations[i].vicinity + ")";
            totalLocations[counter]["distance"] = distanceandDescription;
          }
        else 
        {
          totalLocations[counter]["distance"] = currentDistances[i].toFixed(2);
          
        }  
        
          
          //console.log("parseLocations:", locations[i].name);
          if(locations[i].rating == undefined) continue
           if(distanceandDescription == undefined)
           {
            distanceandDescription = currentDistances[i].toFixed(2);           
          }
            //document.getElementById(tBody[callCount - 1]).innerHTML += "<tr class=\"rowborder\">" + "<td data-title=\"Name:\" id=\"bold\">" + locations[i].name + "</td>" + "<td data-title=\"Rating:\" class=\"rowSize\">" + "&nbsp&nbsp&nbsp" + + locations[i].rating + "</td>" + "<td data-title=\"Distance:\" class=\"rowSize\">" + distanceandDescription+ "</td>" + "<tr>";
            document.getElementById("firstData").innerHTML += "<tr class=\"rowborder\">" + "<td data-title=\"Name:\" id=\"bold\">" + "<p>" + locations[i].name + "</p>" + "</td>" + "<td data-title=\"Rating:\" class=\"rowSize\">" + "&nbsp&nbsp&nbsp" + locations[i].rating  + "</td>" + "<td data-title=\"Distance:\" class=\"rowSize\">"  + distanceandDescription + "</td>" + "<tr>";
        }
        //document.getElementById(tBody[callCount - 1]).innerHTML +="<tr class=\"space\" style=\"height : 100px; border: 0px;\">" + "</tr>";
        progressBar(callCount);
        //fills the progress bar because there are no more locations available
        $("#dataTable").trigger("update");
        if(info.hasNextPage === false)
        {
          progressBar(3);
        }
         
        
        clickModal();
  }
   function progressBar(callCount)
  {
    if (callCount == 1)
      {
        document.getElementById('activeBar').style.width = "33.3%";
      }
    else if (callCount == 2)
      {
        document.getElementById('activeBar').style.width = "66.6%"; 
      }
    else
      {
        document.getElementById('activeBar').style.width = "100%"; 
        $("#activeBar").delay(1000).fadeOut("slow", function()
          {
            $("#bar").css('visibility','hidden');
        });
      }
  }

  function calculateDistance(locations,latitude,longitude)
   {  
      var distanceArray = new Array();
      for (var i=0; i < locations.length; i++)
      {
        distanceArray[i] = getDistanceFromLatLonInKm(latitude, longitude, locations[i].geometry.location.k, locations[i].geometry.location.D)
        //console.log("Distance Value" + distanceArray[i]);
      }
      return distanceArray;
   }
  
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) 
    {
      //var r = 6378100; //Radius of the earth in m
      var R = 6371; // Radius of the earth in km
      var kmtoMi = 0.621371;
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d * 0.621371;
    }

  function deg2rad(deg) 
    {
      return deg * (Math.PI/180)
    }
  
 
function navigate()
  {
    
    var mobileMap = "http://maps.google.com/maps?saddr="+latitude + "," + longitude + "&daddr=" + currLat + "," + currLong;
    var x = document.getElementById('vehicle').value;
    mapUrl = "comgooglemaps://?saddr=" + latitude + "," + longitude + "&daddr=" + currLat + "," + currLong + "&directionsmode=" + x;
    if (isMobile.iOS())
    {
      setTimeout(function () { window.location = mapUrl; }, 25);
      
      window.location = "http://maps.apple.com/maps?saddr=" + latitude + "," + longitude + "&daddr=" + currLat + "," + currLong;
    }
  
   if(isMobile.Android())
     window.location = "http://maps.google.com/maps?saddr="+ latitude + "," + longitude+ "&daddr="+currLat+","+currLong;
  
   window.location = mobileMap;
  }


jQuery(document).ready(function($){
  
  //how long to wait to make the arrow visible.
  var offset = 300,
    //reduce the opacity of the arrow once we reach this point.
    offset_opacity = 1200,
    
    scroll_top_duration = 700,
    //back to top arrow.
    $back_to_top = $('.cd-top');

  //show or hide the arrow.
  $(window).scroll(function(){
    ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
    if( $(this).scrollTop() > offset_opacity ) { 
      $back_to_top.addClass('cd-fade-out');
    }
  });

  //smooth scroll to top
  $back_to_top.on('click', function(event){
    event.preventDefault();
    $('body,html').animate({
      scrollTop: 0 ,
      }, scroll_top_duration
    );
  });

});

  function flip(back)
  {
    if (back === true)
    {
      $(".modal").modal('hide');
       setTimeout(function(){$("#myModal").modal('show');},1500);
    }
    //var front = document.getElementById('myModal');
    
    //var back_content = $('#reviewmodal').html();
    /*var back;
    back = flippant.flip(front, back_content,'card');
    */
    if(back === false)
    {
    $("#myModal").modal('hide');

    setTimeout(function(){
      $('#modaltest').modal({
        keyboard: true
      });
    },500);
    
    }
}


