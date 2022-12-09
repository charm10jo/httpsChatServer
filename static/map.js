// 위경도
let latitude ;
let longitude ;
let myaddress ;
let myregion ; 
$(document).ready(() => {
    navigator.geolocation.getCurrentPosition(
        showYourLocation,
        showErrorMsg,
    );
});

function getAddr(lat,lng){
    let geocoder = new kakao.maps.services.Geocoder();

    let coord = new kakao.maps.LatLng(lat, lng);
    
    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            
            myaddress = result[0].address.address_name;
            // myregion = result[0].address.region_2depth_name;
            console.log('주소 업데이트 완료 !');
        }
    });
    
}

// 좌표 얻어오기
function coordinate(address,callBack){
    let geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address,(result,status)=>{
        if(status ==='OK') callBack(result);
    });
}   

// geolocation
function showYourLocation(pos) {
    // 성공했을때 실행
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    console.log("현재 위치는 : " + latitude + ", " + longitude);
    getAddr(latitude,longitude);
}

function showErrorMsg(error) {

    // 서비스 진입 막기
    $('#loginBtn').attr('disabled','disabled').text('위치정보 수집을 허용해주세요');
    $('#JKGBtn').attr('disabled','disabled').text('위치정보 수집을 허용해주세요');

    // 실패했을때 실행
    switch (error.code) {
    case error.PERMISSION_DENIED:
        alert('위치 엑세스를 허용해주시고 새로고침 해주세요.');
        break;

    case error.POSITION_UNAVAILABLE:
        alert('위치정보 오류 ! 관리자에게 문의 부탁드립니다.');
        break;

    case error.TIMEOUT:
        alert('위치정보 획득 시간 초과 ! 관리자에게 문의 부탁드립니다.');
        break;

    case error.UNKNOWN_ERROR:
        alert('알 수 없는 오류 ! 관리자에게 문의 부탁드립니다.');
        break;
    }
}

function drawMap(addressArray, mapId){
    // 카카오 맵 그리기 (내위치)
    var container = document.getElementById(`map${mapId}`);
    var options = {
        center: new kakao.maps.LatLng(addressArray[0].x, addressArray[0].y),
        level: 3,
    };

    var map = new kakao.maps.Map(container, options);


    // 내 위치 마커
    // 마커가 표시될 위치입니다
    var markerPosition = new kakao.maps.LatLng(addressArray[0].x, addressArray[0].y);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

    drawLine(addressArray,map);
}

function drawLine(addressArray, map){
    let linePath;
    let lineLine = new daum.maps.Polyline();
    let distance;
    
    const myPosition = new kakao.maps.LatLng(addressArray[0].x, addressArray[0].y);

    for (var i = 1; i < addressArray.length; i++) {
        let hospitalPositions = new kakao.maps.LatLng(addressArray[i].x, addressArray[i].y);
        if (i != 0) {
            linePath = [ myPosition, hospitalPositions ] //라인을 그리려면 두 점이 있어야하니까 두 점을 지정했습니다
        };

        lineLine.setPath(linePath); // 선을 그릴 라인을 세팅합니다
 
        var drawLine = new daum.maps.Polyline({
            map : map, // 선을 표시할 지도입니다 
            path : linePath,
            strokeWeight : 3, // 선의 두께입니다 
            strokeColor : '#db4040', // 선의 색깔입니다
            strokeOpacity : 0.4, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
            strokeStyle : 'solid' // 선의 스타일입니다
        });
        drawLine.setPath(linePath);
        drawLine.setMap(map);
        distance = Math.round(lineLine.getLength());
        
        addressArray[i].distance = distance;
        
        displayCircleDot(hospitalPositions, distance, map,addressArray[i].hospitalName, addressArray[i].hospitalAddr);
         
    }
    
}

function displayCircleDot(position, distance, map, hospitalName,hospitalAddr) {
    if (distance > 0) {
        // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
        var distanceOverlay = new daum.maps.CustomOverlay(
                {
                    // content : `<a style="color:black;" target='_blank' href="https://map.kakao.com/?sName=${myaddress}&eName=${hospitalAddr}"><div style="font-size:15px">${hospitalName}</div><div class="dotOverlay" style="font-size:10px">거리 <span class="number">${distance}</span>m</div></a>`,
                    content : `<a style="color:black;" target='_blank' href="https://map.kakao.com/?sName=${myaddress}&eName=${hospitalAddr}"><div style="font-size:15px">${hospitalName}</div></a>`,
                    position : position,
                    yAnchor : 1,
                    zIndex : 1
                });

        // 지도에 표시합니다
        distanceOverlay.setMap(map);
    }
}

