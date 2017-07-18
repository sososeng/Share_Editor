$('.svg-wrapper').hide();

setTimeout(function(){
        $("#sub-title").typed({
            strings: ["- share and collaborate your code"],
            typeSpeed: 45, // typing speed
            backDelay: 750, // pause before backspacing
            loop: false, // loop on or off (true or false)
            loopCount: false, // number of loops, false = infinite
            callback: function(){
              $('.svg-wrapper').show();
              $("#click").typed({
                  strings: ["Click To Start"],
                  typeSpeed: 30, // typing speed
                  backDelay: 750, // pause before backspacing
                  loop: false, // loop on or off (true or false)
                  loopCount: false, // number of loops, false = infinite
                  callback: function(){ } // call function after typing is done
              });
            } // call function after typing is done
        });
    }, 0);
