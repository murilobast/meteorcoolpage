var data = {name: '',server: '', sid: ''};
data.ver = '5.3.1';
var matchHistory = new Object();
var ranked = new Object();
var items = new Object();
var runes = new Object();
var championsData = new Object();
var mainHost = 'http://gankei-backend.herokuapp.com'
//var mainHost = 'http://localhost:3000'
var totalSec = 0;
var games = [];
var team = [];
var sidList1;
var sidList2;
var sidList3;
var sidList4;
var extra = [];
var interval;
var totalSec = 0;
$(function(){
    //$('#ActiveMatch').css('display', 'none');
    
    $('.reload').click(function(e){
        e.preventDefault();
        $.jStorage.flush();
         window.location = 'http://gankei.com/?key=1&server=' + data.server + '&name=' + data.name;
    });
    $('.headerNav a').click(function(){
        if ($(this).hasClass('history') == true && $(this).hasClass('selected') == false){
            $('.matchHistoryContent').css('display', 'block');  
            $('#ActiveMatch').css('display', 'none');
            $('.headerNav a').removeClass('selected');
            $(this).addClass('selected');
            $('.reload').css('display', 'block');
        }
        if ($(this).hasClass('activeMatch') == true && $(this).hasClass('selected') == false){
            clearInterval(interval);
            activeMatch();          
        }            
    });
    $('.share').click(function(){
        $('.modalShare').css('display', 'block');
        $('.shareLink').val('http://gankei.com/?key=1&server=' + data.server + '&name=' + data.name);
        $('a.btn.facebook').prop('href', 'https://www.facebook.com/sharer/sharer.php?u=http://gankei.com/?key=1&server=' + data.server + '&name=' + data.name);
        $('a.btn.twitter').prop('href', 'https://twitter.com/intent/tweet?url=URL&text="http://gankei.com/?key=1&server=' + data.server + '&name=' + data.name + '"');
    });
    
    $('.close').click(function(){
        $('.modalShare').css('display', 'none');
        
    });
    
    if (getUrlParameter('key') == 1){
        infoByUrl();
    }
    if (getUrlParameter('key') == 2){
        activeByUrl();
    }
    data.server = $('.serverOpt').val();
    hideAllBut($(''), 200);
    
    championData();
    itemFloat();
    getRunes();
    
    $('.linkHome').click(function(event){
        event.preventDefault();
        hideAllBut($('#Home'), 200);
    })
    $('.linkContact').click(function(event){
        event.preventDefault();
        hideAllBut($('#Contact'), 200);
    })
    $('.linkAbout').click(function(event){
        event.preventDefault();
        hideAllBut($('#About'), 200);
    })
    $('.send').click(function(event){
        totalSec = undefined;
        $('.matchHistoryContent').css('display', 'block');  
        $('#ActiveMatch').css('display', 'none');
        $('.headerNav a').removeClass('selected');
        $('.history').addClass('selected');
        
        cleanUP();
        hideAllBut($(''), 300);
        $('.modalMsg').css('display', 'block');
        $('.modalMsg p').text('carregando...');
        event.preventDefault();
        data.name = noAcentos($('.name').val().replace(/ /g,'').toLowerCase());
        data.server = $('.serverOpt').val();
        team = [];
        games = [];
        sidList1 = undefined;
        sidList2 = undefined;
        sidList3 = undefined;
        sidList4 = undefined;
        $('.player').show();
        $('.name').val('');
        getItems();
        getRunes();
        //Basic Summoner Info
        ajaxLoL(basicInfoURL(data.server, data.name), function(result){
            data.sid = result[data.name].id;
            $('.outName').text(result[data.name].name);
            $.each($('.players'), function(game){
                $('.players:eq(' + game + ') .outName').text('');
                $('.players:eq(' + game + ') .outName:eq(0)').text(result[data.name].name);
            });
            $('.outLevel').text('Level ' + result[data.name].summonerLevel);
            $('.outIcon').attr('src', imageDb(data.ver, 'profileicon', result[data.name].profileIconId));
            if ($('.tgl').is(':checked')){
                activeMatch();
            }else{
                basicInfo();
            };
        }, 'basic');
    });        
});