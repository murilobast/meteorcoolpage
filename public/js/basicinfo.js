function basicInfo(){

    //Ranked Info
    ajaxLoL(rankedURL(data.server, data.sid), function(result){
        ranked = result;
        
        var totalLP = [0, 0, 0];
        var tier = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'CHALLENGER'];
        var tierBR = {BRONZE: 'BRONZE', SILVER: 'PRATA', GOLD: 'OURO', PLATINUM: 'PLATINA', DIAMOND: 'DIAMANTE', MASTER: 'MESTRE', CHALLENGER: 'DESAFIANTE'};
        var division = ['V', 'IV', 'III', 'II', 'I'];
        var modeType = ['.solo', '.t5v5', '.t3v3'];
        $('.contentHeader .outTier').text(tierBR[ranked[data.sid][0].tier] + ' ' + ranked[data.sid][0].entries[0].division);
        $.each(ranked[data.sid], function(mode){
            console.log(mode);
            if (ranked[data.sid][mode].tier == 'CHALLENGER') {
                totalLP[mode] = 2600;
            }else if (ranked[data.sid][mode].tier == 'MASTER') {
                totalLP[mode] = 2500;
            }else{          
                jQuery.each(tier, function(i){
                    if (ranked[data.sid][mode].tier == tier[i]){
                        totalLP[mode] = i*500;
                    };
                });
                jQuery.each(division, function(i){
                    if (ranked[data.sid][mode].entries[0].division == division[i]){
                        totalLP[mode] = totalLP[mode]+(i*100);
                    };
                });
            };
            $(modeType[mode] + ' .outTier').text(tierBR[ranked[data.sid][mode].tier] + ' ' + ranked[data.sid][mode].entries[0].division);
            $(modeType[mode] + ' .outTierImg').attr('src', '../tier/' + result[data.sid][mode].tier + '_' + ranked[data.sid][mode].entries[0].division+ '.png');
            $(modeType[mode] + ' .outLP').text(ranked[data.sid][mode].entries[0].leaguePoints + ' LP');
            $(modeType[mode] + ' .outElo').text(totalLP[mode] + (parseInt(ranked[data.sid][mode].entries[0].leaguePoints) ) + ' LP Total');
            $(modeType[mode] + ' .outWins').text(' Vitórias ' + ranked[data.sid][mode].entries[0].wins);
            $(modeType[mode] + ' .outLosses').text(ranked[data.sid][mode].entries[0].losses + ' Derrotas');
            var rate = ranked[data.sid][mode].entries[0].wins / (ranked[data.sid][mode].entries[0].wins + ranked[data.sid][mode].entries[0].losses) * 100
            $(modeType[mode] + ' .outRate').text('Win Rate ' + parseInt(rate) + '%');
        });
    }, 'ranked');

    //Match History
    ajaxLoL(matchHistoryURL(data.server, data.sid), function(result) {
        matchHistory = result; 
        jQuery.each(matchHistory.games, function(game){
            extra.push({player: []});
            if (result.games[game].subType == 'BOT') {
                $('.outEnemyMembers:eq(' + game + ') .player').hide();
                extra[game].player.push({champId: '0', sid: '0', name: '-'});
                extra[game].player[0].champId= result.games[game].championId;
                extra[game].player[0].sid= data.sid;
                
                jQuery.each(result.games[game].fellowPlayers, function(player){
                    extra[game].player.push({champId: '0', sid: '0', name: '-'});
                    extra[game].player[player+1].champId= result.games[game].fellowPlayers[player].championId;
                    extra[game].player[player+1].sid= result.games[game].fellowPlayers[player].summonerId;
                    if (sidList4 == undefined){
                        sidList4 = result.games[game].fellowPlayers[player].summonerId;
                    }else{
                        sidList4 = sidList4 + ',' + result.games[game].fellowPlayers[player].summonerId;
                    };
                });     
            }else if (result.games[game].subType == 'BOT_3x3'){
                $('.outEnemyMembers:eq(' + game + ') .player').hide();
                extra[game].player.push({champId: '0', sid: '0', name: '-'});
                extra[game].player[0].champId= result.games[game].championId;
                extra[game].player[0].sid= data.sid;
                $('.outTeamMembers:eq(' + game + ') .player:eq(3)').hide();
                $('.outTeamMembers:eq(' + game + ') .player:eq(4)').hide();
                jQuery.each(result.games[game].fellowPlayers, function(player){
                    extra[game].player.push({champId: '0', sid: '0', name: '-'});
                    extra[game].player[player+1].champId= result.games[game].fellowPlayers[player].championId;
                    extra[game].player[player+1].sid= result.games[game].fellowPlayers[player].summonerId;
                    if (sidList4 == undefined){
                        sidList4 = result.games[game].fellowPlayers[player].summonerId;
                    }else{
                        sidList4 = sidList4 + ',' + result.games[game].fellowPlayers[player].summonerId;
                    };
                });  
            }else if (result.games[game].subType == 'NONE'){
                $('.players:eq(' + game + ')').children('div').hide();
            }else{
                games[game] = result.games[game].fellowPlayers;
            };
            team.push({blue: [], purple: []});
            if (games[game] == undefined){
            }else{
                if (result.games[game].teamId == 100) {
                    for (slot=0;slot<5;slot++) {
                        team[game].blue.push({champId: '0', sid: '0', name: '-'});
                        team[game].purple.push({champId: '0', sid: '0', name: '-'});
                    };
                    var blue = 1;
                    var purple = 0;
                    team[game].blue[0].sid = data.sid;
                    team[game].blue[0].champId = result.games[game].championId;
                    jQuery.each(games[game], function(player){
                        if (games[game][player].teamId == 100) {
                            team[game].blue[blue].champId = result.games[game].fellowPlayers[player].championId;
                            team[game].blue[blue].sid = result.games[game].fellowPlayers[player].summonerId;
                            blue++;
                        }else{
                            team[game].purple[purple].champId = result.games[game].fellowPlayers[player].championId;
                            team[game].purple[purple].sid = result.games[game].fellowPlayers[player].summonerId;
                            purple++;
                        };
                    });
                }else{
                    for (slot=0;slot<5;slot++) {
                        team[game].blue.push({champId: '0', sid: '0', name: '-'});
                        team[game].purple.push({champId: '0', sid: '0', name: '-'});
                    };
                    var blue = 1;
                    var purple = 0;
                    team[game].blue[0].sid = data.sid;
                    team[game].blue[0].name = data.name;
                    team[game].blue[0].champId = result.games[game].championId;
                    jQuery.each(games[game], function(player){
                        if (games[game][player].teamId == 200) {
                            team[game].blue[blue].champId = result.games[game].fellowPlayers[player].championId;
                            team[game].blue[blue].sid = result.games[game].fellowPlayers[player].summonerId;
                            blue++;
                        }else{
                            team[game].purple[purple].champId = result.games[game].fellowPlayers[player].championId;
                            team[game].purple[purple].sid = result.games[game].fellowPlayers[player].summonerId;
                            purple++;
                        };
                    });
                };
                jQuery.each(team[game].blue, function(player){
                    if (game < 8){
                        if (game == 0){
                            if (player == 0 ) {
                                sidList1 =  data.sid;
                                sidList1 =  team[game].blue[player].sid;
                            }else{
                                sidList1 =  sidList1 + ',' + team[game].blue[player].sid;  
                            };
                        }else{
                            sidList1 =  sidList1 + ',' + team[game].blue[player].sid;  
                        };
                    };
                    if (game < 8){
                        if (game == 0){
                            if (player == 0 ) {
                                sidList2 =  data.sid;
                                sidList2 =  team[game].purple[player].sid;
                            }else{
                                sidList2 =  sidList2 + ',' + team[game].purple[player].sid;  
                            };
                        }else{
                            sidList2 =  sidList2 + ',' + team[game].purple[player].sid;  
                        };
                    }; 
                    if (game > 7){
                        if (game == 7){
                            if (player == 0 ) {
                                sidList3 =  data.sid;
                                sidList3 =  team[game].blue[player].sid;
                                sidList3 =  sidList3 + ',' + team[game].purple[player].sid; 
                            }else{
                                sidList3 =  sidList3 + ',' + team[game].blue[player].sid;  
                                sidList3 =  sidList3 + ',' + team[game].purple[player].sid; 
                            };
                        }else{
                            sidList3 =  sidList3 + ',' + team[game].blue[player].sid;  
                            sidList3 =  sidList3 + ',' + team[game].purple[player].sid; 
                        };
                    };
                });
            };
            
            if (sidList1 == undefined) {
                sidList1 = data.sid;
            }
            if (sidList2 == undefined) {
                sidList2 = data.sid;
            }
            if (sidList3 == undefined) {
                sidList3 = data.sid;
            }
            if (sidList4 == undefined) {
                sidList4 = data.sid;
            }

            when = new Date(matchHistory.games[game].createDate);
            var duration = parseInt(matchHistory.games[game].stats.timePlayed/60);
            $('.outDuration:eq(' + game + ')').text(duration + 'min');
            $('.outDate:eq(' + game + ')').text(timeSince(when));
            var item = [1, 2, 3, 4, 5, 6, 7];
            for (var i = 0; i < 7; i++) {
                item[i] = matchHistory.games[game].stats['item' + i];
                if (matchHistory.games[game].stats['item' + i]){
                    if (matchHistory.games[game].stats['item' + i] == 3128 || 3160){
                        $('.outItem' + i + ':eq(' + game + ')').attr('src', imageDb('4.21.1', 'item', item[i]));
                        $('.outItem' + i + ':eq(' + game + ')').attr('alt', item[i]);
                    }else{                                        
                        $('.outItem' + i + ':eq(' + game + ')').attr('src', imageDb(data.ver,+ 'tem', item[i]));
                        $('.outItem' + i + ':eq(' + game + ')').attr('alt', item[i]);
                    };
                };
            };                   
            $('.outK:eq(' + game + ')').text(('0' + (parseInt(matchHistory.games[game].stats.championsKilled) || 0)).slice(-2));
            $('.outD:eq(' + game + ')').text(('0' + (parseInt(matchHistory.games[game].stats.numDeaths) || 0)).slice(-2));
            $('.outA:eq(' + game + ')').text(('0' + (parseInt(matchHistory.games[game].stats.assists) || 0)).slice(-2));
            $('.outGold:eq(' + game + ')').text(('0' + (parseInt(matchHistory.games[game].stats.goldEarned / 1000) || 0)).slice(-2) + 'K GOLD');
            console.log((matchHistory.games[game].subType).replace(/_/g,' '));
            $('.outGameType:eq(' + [game +1]+ ')').text((matchHistory.games[game].subType).replace(/_/g,' '));
            $('.outCreeps:eq(' + game + ')').text(matchHistory.games[game].stats.minionsKilled);
            $('.outSummonerSpell1:eq(' + game + ')').attr('src', '../spell/' + matchHistory.games[game].spell1 + '.png');
            $('.outSummonerSpell2:eq(' + game + ')').attr('src', '../spell/' + matchHistory.games[game].spell2 + '.png');
            if(matchHistory.games[game].stats.win == true) {
               $('.matchHistory .contentMatch:eq(' + game + ')').css('background', 'rgba(26,188,156,0.35)');
            }else if (matchHistory.games[game].stats.win == false) {
                $('.matchHistory .contentMatch:eq(' + game + ')').css('background', 'rgba(231, 76, 60, 0.35)');
            }else{
                $('.matchHistory .contentMatch:eq(' + game + ')').css('background', '#52B3D9');
            };                   
            i++;
        });

        ajaxLoL(summonerNamesURL(data.server, sidList1), function(result){
            jQuery.each(result, function(id){
                jQuery.each(team, function(game){
                   jQuery.each(team[game].blue, function(bluePlayer){
                       if (result[id].id == team[game].blue[bluePlayer].sid){
                           team[game].blue[bluePlayer].name = result[id].name;
                           $('.players:eq(' + game + ') .outName:eq(' + bluePlayer + ')').text(team[game].blue[bluePlayer].name);
                           $('.players:eq(' + game + ') .outName:eq(' + bluePlayer + ')').attr('alt',team[game].blue[bluePlayer].sid);
                           $('.players:eq(' + game + ') .playerLink:eq(' + [bluePlayer] + ')').attr('href', '?key=1&server=' + data.server + '&name=' + team[game].blue[bluePlayer].name);
                       };
                   });
                });
            });
        });

        ajaxLoL(summonerNamesURL(data.server, sidList2), function(result){
            jQuery.each(result, function(id){
                jQuery.each(team, function(game){
                   jQuery.each(team[game].purple, function(purplePlayer){
                       if (result[id].id == team[game].purple[purplePlayer].sid){
                           team[game].purple[purplePlayer].name = result[id].name;
                           $('.players:eq(' + game + ') .outName:eq(' + [purplePlayer+5] + ')').text(team[game].purple[purplePlayer].name);
                           $('.players:eq(' + game + ') .outName:eq(' + [purplePlayer+5] + ')').attr('alt', team[game].purple[purplePlayer].sid);
                           $('.players:eq(' + game + ') .playerLink:eq(' + [purplePlayer+5] + ')').attr('href', '?key=1&server=' + data.server + '&name=' + team[game].purple[purplePlayer].name);
                       };
                   });
                });
            });
        });

        ajaxLoL(summonerNamesURL(data.server, sidList3), function(result){
            jQuery.each(result, function(id){
                jQuery.each(team, function(game){
                    if (game > 7){
                        jQuery.each(team[game].purple, function(purplePlayer){
                            if (result[id].id == team[game].purple[purplePlayer].sid){
                               team[game].purple[purplePlayer].name = result[id].name;
                               $('.players:eq(' + game + ') .outName:eq(' + [purplePlayer+5] + ')').text(team[game].purple[purplePlayer].name);
                               $('.players:eq(' + game + ') .outName:eq(' + [purplePlayer+5] + ')').attr('alt',team[game].purple[purplePlayer].sid);
                                $('.players:eq(' + game + ') .playerLink:eq(' + [purplePlayer+5] + ')').attr('href', '?key=1&server=' + data.server + '&name=' + team[game].purple[purplePlayer].name);
                            };
                        });
                        jQuery.each(team[game].blue, function(bluePlayer){
                            if (result[id].id == team[game].blue[bluePlayer].sid){
                                team[game].blue[bluePlayer].name = result[id].name;
                                $('.players:eq(' + game + ') .outName:eq(' + bluePlayer + ')').text(team[game].blue[bluePlayer].name);
                                $('.players:eq(' + game + ') .outName:eq(' + bluePlayer + ')').attr('alt', team[game].blue[bluePlayer].sid);
                                $('.players:eq(' + game + ') .playerLink:eq(' + [bluePlayer] + ')').attr('href', '?key=1&server=' + data.server + '&name=' + team[game].blue[bluePlayer].name);
                            };
                        });
                        
                   };
                });
            });
        });
        
        ajaxLoL(summonerNamesURL(data.server, sidList4), function(result){
            jQuery.each(result, function(id){
                $.each(extra, function(game){
                    $.each(extra[game].player, function(player){
                        if (result[id].id == extra[game].player[player].sid){
                           extra[game].player[player].name = result[id].name;
                           $('.players:eq(' + game + ') .outName:eq(' + [player] + ')').text(extra[game].player[player].name);
                           $('.players:eq(' + game + ') .outName:eq(' + [player] + ')').attr('alt',extra[game].player[player].sid);
                           $('.players:eq(' + game + ') .playerLink:eq(' + [player] + ')').attr('href', '?key=1&server=' + data.server + '&name=' + extra[game].player[player].name);
                        };
                    });
                });
            });
        });

        //Champion Info
        ajaxLoL(championInfoURL(data.server), function(result) {
            jQuery.each(matchHistory.games, function(game){
                var championName = result.data[matchHistory.games[game].championId].key;
                $('.outChamp:eq(' + game + ')').attr('src', imageDb(data.ver, 'champion', championName));
                $('.outChampionName:eq(' + game + ')').text(championName);
                $('.matchHistory .match:eq(' + game + ')').css('background', 'url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + championName + '_0.jpg)');
                jQuery.each(matchHistory.games[game].fellowPlayers, function(player) {
                    jQuery.each(team[game].blue, function(bluePlayer){
                        if (team[game].blue[bluePlayer].champId != 0){
                            var championTeamName = result.data[team[game].blue[bluePlayer].champId].key;
                            $('.players:eq(' + game + ') .outChampTeam:eq(' + [bluePlayer] + ')').attr('src', imageDb(data.ver, 'champion', championTeamName));
                        };
                    });
                    jQuery.each(team[game].purple, function(purplePlayer){
                        if (team[game].purple[purplePlayer].champId != 0){
                            var championTeamName = result.data[team[game].purple[purplePlayer].champId].key;
                            $('.players:eq(' + game + ') .outChampTeam:eq(' + [purplePlayer+5] + ')').attr('src', imageDb(data.ver, 'champion', championTeamName));
                        };
                    });
                    if (typeof extra[game] != 'undefined'){
                        if (typeof extra[game].player != 'undefined'){
                            jQuery.each(extra[game].player, function(extraPlayer){
                                var championTeamName = result.data[extra[game].player[extraPlayer].champId].key;
                                $('.players:eq(' + game + ') .outChampTeam:eq(' + [extraPlayer] + ')').attr('src', imageDb(data.ver, 'champion', championTeamName));
                            });
                        };
                    };
               });                                     
            });
            $('.modalMsg').css('display', 'none');
            hideAllBut($('#History'), 200);
        }, 'championInfo');
    }, 'matchHistory');
};