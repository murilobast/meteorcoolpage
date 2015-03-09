function activeMatch(event){
    $('.modalRunes p').remove();
    ajaxLoL(activeMatchURL(data.server, data.sid), function(result){
        var configId = {2: 'NORMAL 5X5', 14: 'NORMAL 5X5 DRAFT', 4: 'RANKED SOLO 5X5', 41: 'RANKED TIME 3X3', 42: 'RANKED TIME 5X5', 65: 'ARAM 5X5'}
        //Players information
        jQuery.each(result.participants, function(player){
            var playerName = result.participants[player].summonerName;
            var playerId = result.participants[player].summonerId;
            var playerRunes = result.participants[player].runes;
            runeStats = getTotal(playerRunes);
            ajaxLoL(rankedURL(data.server, playerId), function(result){
                ranked = result;
                $('#ActiveMatch .player:eq(' + player + ') .outRankedStats .outTier').text(ranked[playerId][0].tier + ' ' + ranked[playerId][0].entries[0].division);
                $('#ActiveMatch .player:eq(' + player + ') .outRankedStats .outTierImg').attr('src', '../tier/' + result[playerId][0].tier + '_' + ranked[playerId][0].entries[0].division+ '.png');
                var wins = ranked[playerId][0].entries[0].wins
                var losses = ranked[playerId][0].entries[0].losses
                $('#ActiveMatch .player:eq(' + player + ') .outRankedStats .outRankedWins').text(wins + '/' + losses);
            }, 'ranked');
            var spell1 = result.participants[player].spell1Id;
            var spell2 = result.participants[player].spell2Id;
            var championId = result.participants[player].championId
            var championName = championsData[championId].key
            $('#ActiveMatch .outChampImg:eq(' + player + ')').attr('src', imageDb(data.ver, 'champion', championName));
            $('#ActiveMatch .player:eq(' + player + ') .outSpell1').attr('src', '../spell/' + spell1 + '.png');
            $('#ActiveMatch .player:eq(' + player + ') .outSpell2').attr('src', '../spell/' + spell2 + '.png');
            if (player < 5){
                $('#ActiveMatch .outBluePlayer:eq(' + player + ')').text(playerName);
            };
            if (player > 4){
                $('#ActiveMatch .outPurplePlayer:eq(' + [player-5] + ')').text(playerName);
            };
            
            
            $.each(runeStats, function(stat){
                $('#ActiveMatch .modalRunes:eq(' + player + ')').append('<p>' + (runeStats[stat].value).toFixed(1) + runeStats[stat].desc + '</p>');
            });
            ajaxLoL(statsURL(data.server, playerId), function(result){
                $.each(result.playerStatSummaries, function(mode){
                    if (result.playerStatSummaries[mode].playerStatSummaryType == "Unranked"){
                        $('.outNormalWins:eq(' + player +')').text(result.playerStatSummaries[mode].wins + ' Vitórias Normal');
                    };
                    if (result.playerStatSummaries[mode].playerStatSummaryType == "RankedSolo5x5"){
                        var games = result.playerStatSummaries[mode].wins + result.playerStatSummaries[mode].losses;
                        var avKills = (result.playerStatSummaries[mode].aggregatedStats.totalChampionKills / games).toFixed(0);
                        var avAssits = (result.playerStatSummaries[mode].aggregatedStats.totalAssists / games).toFixed(0);
                        $('.stats .outK:eq(' + player +')').text(avKills + ' Abates');
                        $('.stats .outA:eq(' + player +')').text(avAssits + ' Assistências');
                    };
                });
             });        
        })
        //General information
        var gameLength = window.totalSec || result.gameLength;
        var dataInicial = Date.now() - gameLength * 1000;
        interval = setInterval(function(){
            window.totalSec = parseInt((Date.now() - dataInicial) / 1000);
            var hours = parseInt( totalSec / 3600 ) % 24;
            var minutes = parseInt( totalSec / 60 ) % 60;
            var seconds = totalSec % 60;
            var time = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
            $('.outGameTime').text('Tempo ' + time);
            console.log(totalSec + ' ' + dataInicial);
        }, 1000);
        
        $('.outGameType').text(configId[result.gameQueueConfigId]);
        $('.outServer').text('Server ' + data.server);
        
        $('.history').removeClass('selected');
        $('.activeMatch').addClass('selected');
        $('.matchHistoryContent').css('display', 'none');
        $('#ActiveMatch').css('display', 'block');
        $('.reload').css('display', 'none');
    }, 'activematch');  
};


runesToStrEnUs = ["Armor per Level", "Armor Penetration", "Armor Penetration per Level", "Crit Chance per Level", "Crit Damage per Level", "Energy Regen per Level", "Dodge", "Dodge per Level", "Gold per10", "HP per Level", "HP Regen per Level", "MP Regen per Level", "Ability Power per Level", "Magic Penetration", "Magic Penetration per Level", "MP per Level", "Energy per Level", "Movement Speed per Level", "Attack Damage per Level", "Magic Resist per Level", "Time Dead", "Time Dead per Level", "% Armor Penetration", "% Armor Penetration per Level", "% Attack Speed per Level", "% Cooldown", "% Cooldown per Level", "% Magic Penetration", "% Magic Penetration per Level", "% Movement Speed per Level", "% Time Dead", "% Time Dead per Level", "Armor", "Attack Speed", "Block", "Crit Chance", "Crit Damage", "Energy Regen", "Energy Pool", "EXP Bonus", "HP", "HP Regen", "MP ", "MP Regen", "Ability Power", "Movement Speed", "Attack Damage", "Magic Resist", "% Armor", "% Attack Speed", "% Block", "% Crit Chance", "% Crit Damage", "% Dodge",  "% EXP Bonus",  "% HP",  "% HP Regen", "% MP ", "% MP Regen", "% Ability Power", "% Movement Speed", "% Attack Damage", "% Magic Resist", "% Spell Vamp", "% Life Steal"];
runesToStrPtBr = ["Armadura por Level", "Penetração de Armadura", "Penetração de Armadura por Level", "Crit Chance por Level", "Dano Critico por Level", "Energy Regen por Level", "Esquiva", "Esquiva por Level", "Gold por10", "HP por Level", "HP Regen por Level", "MP Regen por Level", "Poder de Habilidade por Level", "Penetração Magica", "Penetração Magica por Level", "MP por Level", "Energy por Level", "Velocidade de Movimento por Level", "Dano de Ataque por Level", "Resistencia Magica por Level", "Tempo de Morte", "Tempo de Morte por Level", "% Penetração de Armadura", "% Penetração de Armadura por Level", "% Velocidade de Ataque por Level", "% Cooldown", "% Cooldown por Level", "% Penetração Magica", "% Penetração Magica por Level", "% Velocidade de Movimento por Level", "% Tempo de Morte", "% Tempo de Morte por Level", "Armadura", "Velocidade de Ataque", "Block", "Crit Chance", "Dano Critico", "Energy Regen", "Energy", "EXP Bonus", "HP", "HP Regen", "MP ", "MP Regen", "Poder de Habilidade", "Velocidade de Movimento", "Dano de Ataque", "Resistencia Magica", "% Armadura", "% Velocidade de Ataque", "% Block", "% Crit Chance", "% Dano Critico", "% Esquiva",  "% EXP Bonus",  "% HP",  "% HP Regen", "% MP ", "% MP Regen", "% Poder de Habilidade", "% Velocidade de Movimento", "% Dano de Ataque", "% Resistencia Magica", "% Vampirismo Magico", "% Life Steal"];
runeStatName = {rFlatArmorModPerLevel: 0, rFlatArmorPenetrationMod: 0, rFlatArmorPenetrationModPerLevel: 0, rFlatCritChanceModPerLevel: 0, rFlatCritDamageModPerLevel: 0, rFlatEnergyRegenModPerLevel: 0, rFlatDodgeMod: 0, rFlatDodgeModPerLevel: 0, rFlatGoldPer10Mod: 0, rFlatHPModPerLevel: 0, rFlatHPRegenModPerLevel: 0, rFlatMPRegenModPerLevel: 0, rFlatMagicDamageModPerLevel: 0, rFlatMagicPenetrationMod: 0, rFlatMagicPenetrationModPerLevel: 0, rFlatMPModPerLevel: 0, rFlatEnergyModPerLevel: 0, rFlatMovementSpeedModPerLevel: 0, rFlatPhysicalDamageModPerLevel: 0, rFlatSpellBlockModPerLevel: 0, rFlatTimeDeadMod: 0, rFlatTimeDeadModPerLevel: 0, rPercentArmorPenetrationMod: 0, rPercentArmorPenetrationModPerLevel: 0, rPercentAttackSpeedModPerLevel: 0, rPercentCooldownMod: 0, rPercentCooldownModPerLevel: 0, rPercentMagicPenetrationMod: 0, rPercentMagicPenetrationModPerLevel: 0, rPercentMovementSpeedModPerLevel: 0, rPercentTimeDeadMod: 0, rPercentTimeDeadModPerLevel: 0, FlatArmorMod: 0, FlatAttackSpeedMod: 0, FlatBlockMod: 0, FlatCritChanceMod: 0, FlatCritDamageMod: 0, FlatEnergyRegenMod: 0, FlatEnergyPoolMod: 0, FlatEXPBonus: 0, FlatHPPoolMod: 0, FlatHPRegenMod: 0, FlatMPPoolMod: 0, FlatMPRegenMod: 0, FlatMagicDamageMod: 0, FlatMovementSpeedMod: 0, FlatPhysicalDamageMod: 0, FlatSpellBlockMod: 0, PercentArmorMod: 0, PercentAttackSpeedMod: 0, PercentBlockMod: 0, PercentCritChanceMod: 0, PercentCritDamageMod: 0, PercentDodgeMod: 0, PercentEXPBonus: 0, PercentHPPoolMod: 0, PercentHPRegenMod: 0, PercentMPPoolMod: 0, PercentMPRegenMod: 0, PercentMagicDamageMod: 0, PercentMovementSpeedMod: 0, PercentPhysicalDamageMod: 0, PercentSpellBlockMod: 0, PercentSpellVampMod: 0, PercentLifeStealMod: 0}

runeTotalStats = {rFlatArmorModPerLevel: 0, rFlatArmorPenetrationMod: 0, rFlatArmorPenetrationModPerLevel: 0, rFlatCritChanceModPerLevel: 0, rFlatCritDamageModPerLevel: 0, rFlatEnergyRegenModPerLevel: 0, rFlatDodgeMod: 0, rFlatDodgeModPerLevel: 0, rFlatGoldPer10Mod: 0, rFlatHPModPerLevel: 0, rFlatHPRegenModPerLevel: 0, rFlatMPRegenModPerLevel: 0, rFlatMagicDamageModPerLevel: 0, rFlatMagicPenetrationMod: 0, rFlatMagicPenetrationModPerLevel: 0, rFlatMPModPerLevel: 0, rFlatEnergyModPerLevel: 0, rFlatMovementSpeedModPerLevel: 0, rFlatPhysicalDamageModPerLevel: 0, rFlatSpellBlockModPerLevel: 0, rFlatTimeDeadMod: 0, rFlatTimeDeadModPerLevel: 0, rPercentArmorPenetrationMod: 0, rPercentArmorPenetrationModPerLevel: 0, rPercentAttackSpeedModPerLevel: 0, rPercentCooldownMod: 0, rPercentCooldownModPerLevel: 0, rPercentMagicPenetrationMod: 0, rPercentMagicPenetrationModPerLevel: 0, rPercentMovementSpeedModPerLevel: 0, rPercentTimeDeadMod: 0, rPercentTimeDeadModPerLevel: 0, FlatArmorMod: 0, FlatAttackSpeedMod: 0, FlatBlockMod: 0, FlatCritChanceMod: 0, FlatCritDamageMod: 0, FlatEnergyRegenMod: 0, FlatEnergyPoolMod: 0, FlatEXPBonus: 0, FlatHPPoolMod: 0, FlatHPRegenMod: 0, FlatMPPoolMod: 0, FlatMPRegenMod: 0, FlatMagicDamageMod: 0, FlatMovementSpeedMod: 0, FlatPhysicalDamageMod: 0, FlatSpellBlockMod: 0, PercentArmorMod: 0, PercentAttackSpeedMod: 0, PercentBlockMod: 0, PercentCritChanceMod: 0, PercentCritDamageMod: 0, PercentDodgeMod: 0, PercentEXPBonus: 0, PercentHPPoolMod: 0, PercentHPRegenMod: 0, PercentMPPoolMod: 0, PercentMPRegenMod: 0, PercentMagicDamageMod: 0, PercentMovementSpeedMod: 0, PercentPhysicalDamageMod: 0, PercentSpellBlockMod: 0, PercentSpellVampMod: 0, PercentLifeStealMod: 0}

$(function(){
    var i = 0;
    for (name in runeStatName){
        runeStatName[name] = runesToStrPtBr[i];
        i++
    };
});
function getTotal(runeObj){
    runeStats = [];
    string = [];
    String.prototype.beginsWith = function (string) {
        return(this.indexOf(string) === 0);
    }
    $.each(runeObj, function(obj){
        runeStats.push(runes[runeObj[obj].runeId].stats);
        propertyName = Object.getOwnPropertyNames(runeStats[obj]);
        count = runeObj[obj].count;
        if(propertyName == 'PercentAttackSpeedMod' || propertyName == 'rPercentCooldownMod' || propertyName == 'PercentMovementSpeedMod' || propertyName == 'rPercentCooldownModPerLevel'|| propertyName == 'FlatCritChanceMod'){
            runeTotalStats[propertyName] = runeTotalStats[propertyName] + ((runeStats[obj][propertyName]*100)*count);
        }else{
            runeTotalStats[propertyName] = runeTotalStats[propertyName] + (runeStats[obj][propertyName]*count);
        };
    });
    $.each(runeTotalStats, function(stat){
        if (runeTotalStats[stat] < 0) {
            console.log(runeStatName[stat]);
        }
        if (runeTotalStats[stat] != 0) {
            desc = (' ' + runeStatName[stat]);
            value = runeTotalStats[stat];
            string.push({desc: desc, value: value});
            runeTotalStats[stat] = 0;
        };
    });
    return string;
};

$(function(){
    $('.outRunePage').mouseenter(function(){ 
        $(this).parent().children('.modalRunes').css('display', 'block');
    }).mouseleave(function(){
        $('.modalRunes').css('display', 'none');
    });
    $('.outRunePage').on('mousemove', function(e){
        item = $(this);
        $('.modalRunes').css({
           left:  item.position().left,
           top:   item.position().top + 18
        });
    });
});





