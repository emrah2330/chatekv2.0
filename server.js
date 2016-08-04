var io = require('socket.io').listen(3000); //3000 portunu dinlemeye başladık.
var kullanicilar = {};
var sohbetler = {};
var say=0;
var sohbetsay=0;
var ozelsohbetler = {};
var ozelsohbetsay = 0;
var adet=0;



    io.sockets.on('connection', function(socket){ // tüm node işlemlerini kapsayan ana fonksiyonumuz
   socket.on("kullaniciEkle", function(data){
        // Kullanıcı session'nda bilgileri saklıyoruz
		var kullaniciadi=data.kadi;
        socket.kullaniciAdi = kullaniciadi;
        socket.userId = kullanicilar.length;
		
		for(key in kullanicilar){
			if(kullanicilar[key].userName == kullaniciadi){
				say++;
			}
		}
        // Array'e kullanıcı bilgilerini ekliyoruz
		if(say == 0){
			
        kullanicilar[kullaniciadi] = {
            'userName' : kullaniciadi,
            'userId' : kullanicilar.length,
			'color':''
        };
		data.kadi="Hoşgeldin "+kullaniciadi;

        // Bağlanan kullanıcıya hoşgeldin mesajı yolluyoruz
        socket.emit("mesajGonder", "Sistem", data);
		data.kadi=kullaniciadi + " muhabbete bağlandı.";

        // Bütün kullanıcılara yeni kullanıcı bağlandı mesajı yolluyoruz
        socket.broadcast.emit("mesajGonder", "Sistem", data);

		
        // Bağlı kullanıcılarda Kullanıcı listesini yeniliyoruz
        io.sockets.emit("kullanicilariYenile",kullanicilar,sohbetler);
		
		}else{
			
			socket.emit("kullaniciMevcut");
		}
    });

		//özel sohbet sorgulama varmı yokmu
		var osv=0;
		socket.on('sorgula',function(data){
		
		for(key in sohbetler){
			if(sohbetler[key].kime == data.kime || sohbetler[key].kimden == data.kime){
				osv = 1;
			}else{ osv = 0;}
			
			
			
		}
		socket.emit("sorgulacevap",{"adet":osv});
		});
		
		
		
		//Özel sohbet ekle fonksiyonu
		
		socket.on('sohbetEkle',function(data){
			var sohbetvarmi=0;
		for(key in sohbetler){
			if(sohbetler[key].sohbetadi == data.kimden+data.kime){
				sohbetvarmi++;
			}
		}
			
			if(sohbetvarmi == 0){
			sohbetsay++;
			sohbetler[sohbetsay] = {
				'sohbetadi':data.kimden+data.kime,
				'kimden':data.kimden,
				'kime':data.kime,
				'sohbetid'  :sohbetsay,
				};
			}	
		
				 // Bağlı kullanıcılarda özelsohbet listesini yeniliyoruz
				io.sockets.emit("ozelSohbet",{'sohbetler':sohbetler});
			});
		
		//ozelsohbetekleme fonksyionu
		
		socket.on('ozelmesajYolla',function(data){
			ozelsohbetsay++;
			ozelsohbetler[ozelsohbetsay] = {
				"chatid":data.chatid,
				"mesaj":data.mesaj,
				"renk":data.renk,
				"kimden":data.kimden,
				"kime":data.kime,
				'say':ozelsohbetsay
			};
			// Bağlı kullanıcılarda özelsohbet listesini yeniliyoruz
				io.sockets.emit("ozelmesajYollaDonus",{'ozelsohbetler':ozelsohbetler});
		});
		
		
		
		//Özel sohbet silme fonnksiyonu
		
		socket.on('ozelSohbetSil',function(data){
			
			
			for(key in ozelsohbetler){
				if(ozelsohbetler[key].kimden == data.kimden || ozelsohbetler[key].kimden == data.kime){
					var oss = ozelsohbetler[key].say;
					var sohbetid = ozelsohbetler[key].chatid;
					delete ozelsohbetler[oss];
					
				}
			}
			
				delete sohbetler[data.sohbetid];
					
					io.sockets.emit("ozelSohbetSilDonus",{"islem":data.kimden+" özel sohbetten ayrıldı","kimden":data.kimden,"kime":data.kime},sohbetler);
					
				
				
			
		});


    // Client tarafından mesaj yollama fonksiyonu
    socket.on("mesajYolla", function(data){
	socket.renk=data.renk;
	 kullanicilar[socket.kullaniciAdi] = {
            'userName' : socket.kullaniciAdi,
            'userId' : kullanicilar.length,
			'color':socket.renk
        };
	// Bağlı kullanıcılarda Kullanıcı listesini yeniliyoruz
        io.sockets.emit("kullanicilariYenile", kullanicilar,sohbetler);
        // Bağlı kullanıcılara kullanıcıdan gelen mesajı yolluyoruz
        io.sockets.emit("mesajGonder", socket.kullaniciAdi, data);
    });

		// Bağlantı kesildiği takdirde çalışacak fonksiyon
    socket.on("disconnect", function(data){
		if(say == 0){
        // Kullanıcıyı listeden siliyoruz
        delete kullanicilar[socket.kullaniciAdi];


        // Bağlı kullanıcılarda Kullanıcı listesini yeniliyoruz
        io.sockets.emit("kullanicilariYenile", kullanicilar,sohbetler);
			
			for(key in ozelsohbetler){
				if(ozelsohbetler[key].kimden == (socket.kullaniciAdi).toLowerCase() || ozelsohbetler[key].kime == (socket.kullaniciAdi).toLowerCase()){
					var oss = ozelsohbetler[key].say;
					var sohbetid = ozelsohbetler[key].chatid;
					delete ozelsohbetler[oss];
					delete sohbetler[sohbetid];
					
				}
			}
			io.sockets.emit("userCiktiOzelSil");

        // Bağlı kullanıcılara kullanıcı çıktı mesajı yolluyoruz
        socket.broadcast.emit("mesajGonder", "Sistem", {'kadi':socket.kullaniciAdi + " muhabbetten ayrıldı :("});
		}else{
			say=0;
		}
    });
	
	
		
});

 

