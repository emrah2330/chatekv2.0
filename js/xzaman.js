(function($){ 
//alert(99); 
$.fn.zaman_once = function(ayarlar){ 
var ayar = $.extend({ 
'data' : 'tarih' 
},ayarlar); 
//alert(Math.floor(gecen) + " " + tur); 
return this.each(function(){ 
//alert(ayar.data); 
var budata = $(this).data(ayar.data); 
//alert(budata); 
var simdi = new Date().getTime() / 1000; 
simdi = Math.floor(simdi); 
//var ts = Date.parse(budata); 
//alert(simdi + ' - ' + budata); 
var zamanfark = simdi - budata; 
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
$(this).html(Math.floor(gecen) + " " + tur + " önce"); 
}); 
} 
})(jQuery);