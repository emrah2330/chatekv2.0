		var kullaniciRenk="";
		var kullaniciSes="open";
		var scrol=0;
		var chatid;
		var sohbetsorgula=0;
            $(document).ready(function(){
				
		
					
				
			var renk_paleti_ac=0;
			var sesAcKapa=0;
			
			$("ul.ayarlar li:eq(0)").click(function(){
			if(sesAcKapa == 0){
			$(this).attr('title','Sesi Aç').css({"background": "url('images/icon.png') 117px 302px"});
			$("div.islemSonuc ul li:eq(0)").html('<b>Ses :</b> { <span style="color:#000">Kapalı</span> }');
			sesAcKapa++;
			kullaniciSes='close';
			}else{
			$(this).attr('title','Sesi Kapa').css({"background": "url('images/icon.png') 69px 302px"});
			$("div.islemSonuc ul li:eq(0)").html('<b>Ses :</b> { <span style="color:#000">Açık</span> }');
			sesAcKapa--;
			kullaniciSes='open';
			}
			
			});
			
			
			$("ul.ayarlar li:eq(1)").click(function(){
			if(renk_paleti_ac == 0){
			$("div.renkler").fadeIn("slow");
			renk_paleti_ac++;
			}else{
			$("div.renkler").fadeOut("slow");
			renk_paleti_ac--;
			}
			});
			
			$("ul.renk_sec li").click(function(){
			kullaniciRenk=$(this).attr("data");
			kullaniciRenkTitle=$(this).attr("title");
			$("div.islemSonuc ul li:eq(1)").html('<b>Renk :</b> { <span style="color:#'+kullaniciRenk+'">'+kullaniciRenkTitle+'</span> }');
			$("div.islemSonuc ul li:eq(2) span").css({'color':'#'+kullaniciRenk});
			$("div.renkler").fadeOut("slow");
			renk_paleti_ac=0;
			});
			
			
			
			$("div.giris_btn").click(function(){
			var kadi=decodeEntities($("input.giris").val());
			
			if(kadi!=""){
			
			$("div.islemSonuc ul li:eq(2)").html('<b>Kullanıcı Adı :</b> { <span class="kadi" style="color:#000">'+kadi+'</span> }');
			socketTaraf(kadi);
			
			
			}else{
				$("input.giris").val("");
			}
			});
			
			
			
	
			 $('.yazilanlar').perfectScrollbar({
			suppressScrollX: true,
			wheelSpeed: 20
		});
		
		 $('div#kullanicilar').perfectScrollbar({
			suppressScrollX: true,
			wheelSpeed: 20
		});
		

            
			$("input.input").keypress(function(e){
			if(e.which == 13){
			var mesaj=decodeEntities($(this).val());
			if(mesaj){
		$("input.input").keypress();
			}else{
				alert('Güzel şeyler yazıp göndermeyi deneyin ! :)');
			}
			}
			});
			
		
		
	

			
        });

	
		

		
		
		
		function zaman_cevir(a){
		
		var simdi = new Date().getTime() / 1000; 
simdi = Math.floor(simdi); 
//var ts = Date.parse(budata); 
//alert(simdi + ' - ' + budata);

var zamanfark = simdi - a; 
var gecen; 
var tur; 
if(zamanfark < (60)) { 
gecen = zamanfark; 
tur = "sn"; 
} else 
if(zamanfark < (60 * 60)) { 
gecen = zamanfark / 60; 
tur = "dk"; 
} else if(zamanfark < (24 * 60 * 60)) { 
gecen = zamanfark / (60 * 60); 
tur = "saat"; 
} else if(zamanfark < (30 * 24 * 60 * 60)) { 
gecen = zamanfark / (24 * 60 * 60); 
tur = "gün"; 
} else if(zamanfark < (365 * 24 * 60 * 60)) { 
gecen = zamanfark / (30 * 24 * 60 * 60); 
tur = "ay"; 
} else { 
gecen = zamanfark / (365 * 24 * 60 * 60); 
tur = "yıl"; 
} 
var gonder= Math.floor(gecen) + " " + tur + " önce yazıldı."; 


return gonder;


		
		
		
		}
		
		
		
		
		
function socketTaraf(kadi){
		var socket = io.connect(); // 3000 portuna connect olduk
			
			socket.on('connect',function(){
			  socket.emit("kullaniciEkle", {'mesaj':'','renk':'','kadi':ilk_harf_buyuk(kadi),'connect':''});
        $('.giris_ekrani').fadeOut("slow", function(){
            $('#genel').fadeIn("slow");
        });		


					
		
});


$("input[name=mesaj]").keyup(function(){
			socket.emit('yazanlar',$("span.kadi").text());
			socket.on('yazanlarlistele',function(data){
					$("p.yaziyor").text(data+" şuanda sohbete yazıyor...");
		setTimeout(function(){
			$("p.yaziyor").text("");
		}, 5000);
				});
		});
		

			

				$("body").delegate('ul.kullanicilar li','click',function(){
					
				var kime = kucult($(this).attr('data'));
				var kimden = $("span.kadi").text();
				var sohbetadi= $(this).attr("sohbetadi");
				if(kimden != kime){
				if(sohbetadi == "bos"){
					
					if(sohbetadi != (kimden+kime) || sohbetadi == "" ){
						
						
						socket.emit('sohbetEkle',{'kimden':kimden,'kime':kime});
						
					}else{
						//sohbetadi boş değil ise sohbetadına ait verileri çek
					}
					
				}else{alert(kime+" adlı kullanıcı şuanda meşgul.");}
				}else{return false;}
		
				});
				

			
				
			
			
			
		//kullanıcı oturumdan çıktıysa
		socket.on('userCiktiOzelSil',function(veri,sohbetler){
			
					$("ul.kullanicilar li").each(function(){
						
						if($("span.kadi").text() == veri.kime || $("span.kadi").text() == veri.kimden){
							$("div.ozel").hide();
							$(this).attr("sohbetadi","bos");
							$("ul.ozelmesajlar li").remove();
							
						}
					});
					
					$("ul.kullanicilar li").each(function(index){
			
				for(a in sohbetler){
					if(sohbetler[a].kime == kucult($(this).attr('data')) || sohbetler[a].kimden == kucult($(this).attr('data'))){
						$(this).attr('sohbetadi',sohbetler[a].sohbetadi);
					}else{
						$(this).attr('sohbetadi',"bos");
					}
				}
		
		});
		});
		
			   // Mesaj Gonderme Fonksiyonu
    socket.on("mesajGonder", function(kullaniciadi, data){
        // Mesajı konuşma penceresine yaz
			
			var simdi = new Date().getTime() / 1000; 
			simdi = Math.floor(simdi);
			
			if(data.kadi){
			
			$("ul.yazilar").append('<li><p class="cizgi"></p><p class="nokta"><span>.</span></p><img src="images/user.png" alt=""\><p><b style="color:#'+data.renk+'">'+ilk_harf_buyuk(kullaniciadi)+'</b> <span style="font-weight:bold; color:#555;font-size:12px;">diyorki;</span></p><p class="mesaj">'+data.kadi+'</p><p class="onayla"><em class="onay"></em></p><div data="'+simdi+'"></div></li>');
			}else{
			$("ul.yazilar").append('<li><p class="cizgi"></p><p class="nokta"><span>.</span></p><img style="border:1px solid #'+data.renk+'" src="images/user.png" alt=""\><p><b style="color:#'+data.renk+'">'+ilk_harf_buyuk(kullaniciadi)+'</b> <span style="font-weight:bold; color:#555; font-size:12px;">diyorki;</span></p><p class="mesaj" style="color:#'+data.renk+'">'+data.mesaj+'</p><p class="onayla"><em class="onay"></em></p><div data="'+simdi+'"></div></li>');
			}
			scrol=scrol+70;
			$('div.yazilanlar').perfectScrollbar("update").scrollTop(scrol);
			yeni();//ses dosyası
			
		//Kaç zaman önce yazıldı 
			setInterval(function(){
			
			$("ul.yazilar li").each(function(i){
	var data=$("ul.yazilar li:eq("+i+") div").attr("data");
	var zmn=zaman_cevir(data);
	$("ul.yazilar li:eq("+i+") div").html(zmn);
	});
			
			},1000*60);
	
    });
	
	
	// Kullanıcı mevcut ise
	socket.on("kullaniciMevcut", function(data){
		location.reload();
		
	});
	
	// Kullanıcı listesini yenileme fonksiyonu
    socket.on("kullanicilariYenile", function(kullanicilar,veri){
		
		
		
		
		
		
        // Kullanıcıların yazdığı ekranı temizle
        $("ul.kullanicilar li").remove();
        // Kullanıcı isimlerini ekrana yaz
        $.each(kullanicilar, function(key, value){
			
		$("ul.kullanicilar").append('<li sohbetadi="bos" data="'+key+'"><img style="border:1px solid #'+value.color+'" src="images/user.png" alt=""\> <p style="color:#'+value.color+'">'+key+'</p><span class="online"></span></li>');
		$('div#kullanicilar').perfectScrollbar("update");
		
		//Kullanıcı adedinin bulunması
		var adet=$("ul.kullanicilar li").length;
		$("div.sol p.baslik").html('Kullanıcılar {'+adet+'}');
		gelen(); //ses dosyası
            
        });
		
		$("ul.kullanicilar li").each(function(index){
			
				for(a in veri){
					if(veri[a].kime == kucult($(this).attr('data')) || veri[a].kimden == kucult($(this).attr('data'))){
						$(this).attr('sohbetadi',veri[a].sohbetadi);
					}
				}
		
		});
	
    });
		
		
		socket.on('ozelSohbet',function(veri){
			
				
				$.each(veri, function(key, value){
				$.each(value,function(a,b){
					$("ul.kullanicilar li").each(function(index){
						if(b.kime == kucult($(this).attr("data")) || b.kimden == kucult($(this).attr("data"))){
							$(this).attr("sohbetadi",b.sohbetadi);
						}
					});
					if($("span.kadi").text() == b.kime){
					$("div.ozel").show();
					$("span.ozelbaslikyaz").attr("data",b.sohbetid).text(b.kimden);
					}else if($("span.kadi").text() == b.kimden){
						$("div.ozel").show();
					$("span.ozelbaslikyaz").attr("data",b.sohbetid).text(b.kime);
					}
					
					chatid = b.sohbetid;
				});
				
			 });
			
			
		});
	
				$("span.ozelkapa").click(function(){
					var sohbetid = $("span.ozelbaslikyaz").attr("data");
					var kimden = $("span.kadi").text();
					var kime = $("span.ozelbaslikyaz").text();
					socket.emit('ozelSohbetSil',{'sohbetid':sohbetid,'kimden':kimden,'kime':kime});
				});
				
				socket.on('ozelSohbetSilDonus',function(veri,sohbetler){
					
					
					$("ul.kullanicilar li").each(function(){
						
						if($("span.kadi").text() == veri.kime || $("span.kadi").text() == veri.kimden){
							$("div.ozel").hide();
							$("ul.ozelmesajlar li").remove();
							$("span.ozelbaslikyaz").text("");
							
						}
						if($.isEmptyObject(sohbetler)){
					  $(this).attr('sohbetadi',"bos");
					}else{
							for(a in sohbetler){
					if(sohbetler[a].kime == kucult($(this).attr('data')) || sohbetler[a].kimden == kucult($(this).attr('data'))){
						$(this).attr('sohbetadi',sohbetler[a].sohbetadi);
					}else{
						$(this).attr('sohbetadi',"bos");
						
					}
				}
					}
					});
					
			
					
					
					if($("span.kadi").text() == veri.kime){
					var simdi = new Date().getTime() / 1000; 
			simdi = Math.floor(simdi);
			$("ul.yazilar").append('<li><p class="cizgi"></p><p class="nokta"><span>.</span></p><img style="border:1px solid red" src="images/user.png" alt=""\><p><b style="color:red">Sistem</b> <span style="font-weight:bold; color:#555; font-size:12px;">diyorki;</span></p><p class="mesaj" style="color:red">'+veri.islem+'</p><p class="onayla"><em class="onay"></em></p><div data="'+simdi+'"></div></li>');
			scrol=scrol+70;
			$('div.yazilanlar').perfectScrollbar("update").scrollTop(scrol);
			yeni();//ses dosyası
					}
				});
	
			$("input.ozelmesaj").keypress(function(e){
			if(e.which == 13){
			var ozelmesaj=decodeEntities($(this).val());
			if(ozelmesaj){
			var kimden = $("span.kadi").text();
			var kime = $("span.ozelbaslikyaz").text();
			socket.emit('ozelmesajYolla', {"mesaj":ozelmesaj,"renk":kullaniciRenk,"chatid":chatid,"kimden":kimden,"kime":kime});
			
			
			$(this).val("");
			}else{
				alert('Güzel şeyler yazıp göndermeyi deneyin ! :)');
			}
			}
			});
			
			socket.on('ozelmesajYollaDonus',function(veri){
				var ekle="";
				$.each(veri, function(key, value){
					$.each(value,function(a,b){
						if(b.kime == $("span.ozelbaslikyaz").text() || b.kimden == $("span.ozelbaslikyaz").text()){
							ekle=ekle+'<li><span><b style="color:#'+b.renk+'; text-transform:capitalize;">'+b.kimden+':</b> '+b.mesaj+'</span></li>';
						}
					});
					
				});
				$("ul.ozelmesajlar").html(ekle);
				$(".ozelmesajgenel").animate({ scrollTop: $(document).height() }, 0);
			});


			$("input.input").keypress(function(e){
			if(e.which == 13){
			var mesaj=decodeEntities($(this).val());
			if(mesaj){
		
			

			socket.emit('mesajYolla', {"mesaj":mesaj,"renk":kullaniciRenk});
			
			
			$(this).val("");
			}else{
				alert('Güzel şeyler yazıp göndermeyi deneyin ! :)');
			}
			}
			});
			
			
			
			
			
	
		
			

			
			
}



var decodeEntities = (function () {
        //create a new html document (doesn't execute script tags in child elements)
        var doc = document.implementation.createHTMLDocument("");
        var element = doc.createElement('div');

        function getText(str) {
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
            return str;
        }

        function decodeHTMLEntities(str) {
            if (str && typeof str === 'string') {
                var x = getText(str);
                while (str !== x) {
                    str = x;
                    x = getText(x);
                }
                return x;
            }
        }
        return decodeHTMLEntities;
    })();

  



function ilk_harf_buyuk(data){

var kucult=data.toLowerCase();
var ilkharf=kucult.substr(0,1).toUpperCase();
var sonharfler=kucult.substr(1);
var gonder=ilkharf+sonharfler;
return gonder;
}

function kucult(data){

var kucult=data.toLowerCase();
return kucult;
}

function zaman_yaz(){
$("ul.yazilar li").each(function(i){
	var data=$("ul.yazilar li:eq("+i+") div").attr("data");
	var zmn=zaman_cevir(data);
	$("ul.yazilar li:eq("+i+") div").html(zmn);
	});

}