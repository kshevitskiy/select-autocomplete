var wrapper = $('.select');

var SELECT = {

    markup: function(element) {

        var select      = element.find('select'),
            placeholder = select.data('placeholder'),
            option      = select.find('option'),
            search      = $('<input type="search" class="select__search" value="">'),
            arrow       = $('<span class="select__arrow"></span>'),
            list        = $('<ul class="select-list"></ul>');                        

        if ( placeholder ) {
            search.attr('placeholder', placeholder);
        } else {
            search.attr('placeholder', option.first().text());
        }

        element.append(search);
        element.append(arrow);
        element.append(list);

        option.each(function() {
            var item = $('<li data-value="' + $(this).val() + '" class="select-list__item">'+ $(this).text() +'</li>');
            item.appendTo(list);
        });
    },

    value: function(option) {
        option.parent().find('select').val(option.data('value'));
        console.log(option.data('value'));
    },    

    focus: function(element) {
        element.on('focus', function() {
            element.parent().addClass('active');
            element.parent().find('.select-list').fadeIn(250);
        });
    },
  
    blur: function(element) {
        element.on('blur', function() {
            element.parent().removeClass('active');
            element.parent().find('.select-list').fadeOut(250);
        });                
    },

    click: function(option, search) {
        option.on('click', function(e) {
            search.val( $(this).text() );
            e.preventDefault();            

            //** Show current select value
            // console.log(search.val());

            SELECT.value($(this));            
        });
    },    

    search: function(option, input) {        
        input.on('keyup', function() {
            var index = new Array;

            for (i = 0; i < option.length; i++) {
                var value  = $(option[i]).text().toUpperCase(),
                    search = input.val().toUpperCase();                
              
                if (value.indexOf(search) > -1) {
                    $(option[i]).css('display', 'block');
                    index.push(i);
                } else {
                    $(option[i]).css('display', 'none');
                }
            }

            SELECT.enter(option, input, index);

            //** Show current search input value
            // console.log(input.val());
        });    
    },


    enter: function(option, input, index) {
        input.keydown(function(e) {             
            if (e.keyCode == 13) {
                e.preventDefault();
                input.val( $(option[index[0]]).text() ); 
                // SELECT.value($(option[index[0]]));
                input.blur();
            }
        });
    },   

    init: function() {
        wrapper.each(function() {
            SELECT.markup($(this));           

            var $this  = $(this),
                search = $this.find('.select__search'),
                select = $this.find('select'),
                option = $this.find('.select-list__item');

            SELECT.focus(search);
            SELECT.blur(search);
            SELECT.click(option, search);
            SELECT.search(option, search);            
        });
    }
}



module.exports = {
    init : SELECT.init    
};