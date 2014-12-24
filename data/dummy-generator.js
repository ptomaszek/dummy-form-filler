var DummyGenerator = function() {
	var DEI_KOBOL = 'Dei Kobol una apita uthoukarana ' + 'Ukthea mavatha gaman kerimuta '
			+ 'Obe satharane mua osavathamanabanta ' + 'Api obata yagnya karama'
			+ 'ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn';

	var LETTERS = "abcdefghijklmnopqrstuvwxyz";

	var DUMMY_EMAIL = chance.email();

    /**
    * Returns random number that meets given limitations, i.e. min and max
    * values.
    */
    this.getDummyNumber = function(limits) {
        try {
            return chance.natural({
                min : limits.min,
                max : limits.max
            });
        }
        catch(err) {
            DummyLogger.log(err);
        }
    }

   	/**
   	 * Returns random text of a given length. First letter uppercased.
   	 */
   	this.getDummyText = function(limits) {
       if (typeof limits === 'undefined') {
           return;
       }

       try {
           var text = $.trim(chance.string({
               length : chance.natural({
                   min : limits.minlength,
                   max : limits.maxlength
               }),
               pool : DEI_KOBOL
           }));

           return chance.capitalize(text);
       }
       catch(err) {
          DummyLogger.log(err);
       }
   	}

   	/**
   	 * Returns random phone number.
   	 */
   	this.getDummyPhone = function(limits) {
   		return chance.phone({
   			formatted : false
   		});
   	}

   	this.getDummyEmail = function() {
    		return DUMMY_EMAIL;
    	}

    this.getDummyDomain = function() {
        return chance.domain();
    }

    this.getDummyPassword = function() {
        return "0Pa$$4uM^t3";
    }

    this.getDummyDate = function(limits) {
        try {
           return chance.date({
                min: limits.min,
                max: limits.max
            }).toISOString().split('T')[0];
        }
        catch(err) {
            DummyLogger.log(err);
        }
    }

    return this;
};