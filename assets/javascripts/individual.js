$(document).ready(function () {
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //     Controller
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $( document ).uitooltip(); 
  $('#wizard_tab_nav a[href="#intro_page"]').tab('show')
  INCOME = "#income";
  SALESTAXPAYMENTMANUAL = "#salesTaxPayment";
  SALESTAXPAYMENTAUTO = "#salesTaxPayment_filled";
  INCOMEWFR = "#income1";
  DEPENDENTS = "#dependents";
  EITCAUTO = "#eitc_filled"
  EITCMANUAL = "#eitc";
  GALLONS = "#gallons";
  GALLONSFREQ = "#gasTimeframe";
  GASCOST = "#gasCost";
  DOLLARS = "#dollars";
  DOLLARFREQ = "#dollarTimeframe";
  MPG = "#mpg";
  MILES = "#miles";
  MILEAGEFREQ = "#mileageTimeframe";
  SEATMILES = "#seatMiles";
  PERCENTSPLIT = "#percentSplit";
  ZIPCODE = "#zipcode";
  UTILITIES = "#utilities";
  PERCENTOFAVERAGE = "#percentOfAverage";
  THERMS = "#thermsNatGas";
  FUELOIL = "#gallonsFuelOil";
  KWH = "#kWhElec";
  SALESTAXSAVINGS = "#salesTaxSavings";
  WFRSAVINGS = "#wfrSavings";
  GASTAXES = "#gasolineLosses";
  AIRTAXES = "#airTaxes";
  NATGASTAXES = "#natGasLosses";
  FUELOILTAXES = "#fuelOilLosses";
  ELECTAXES = "#elecLosses";
  HOMETAXES = "#homeEnergyLosses";
  TOTALSAVINGS = "#totalSavings_static";
  TOTALCOSTS = "#totalCosts_static";
  TOTALNET = "#totalNet_static";
  UTILITYREMEMBERED = "#utilityRemembered";
  PAGEREMEMBERED = "#pageRemembered";
  alertSent = false;
  prevErrorCount = 0;

  model = new Model();
  updateRadios();
  updateUtilities();
  //$('#wizard_tab_nav a[href=' + $(PAGEREMEMBERED).val() + ']').tab('show');
  //updateModel();
  //updateBoxesAndSpans();

  function updateModel() {
    
    model.setIncome($(INCOME).val());

    model.setSalesTax(parseInt($("input[name=taxOption]:checked").val()), $(SALESTAXPAYMENTMANUAL).val());

    model.setEitc(parseInt($(DEPENDENTS).val()), parseInt($("input[name=taxStatus]:checked").val()));

    model.setWfr(parseInt($("input[name=eitcOption]:checked").val()), $(EITCMANUAL).val());

    model.setGas(parseInt($("input[name=gas]:checked").val()), $(GALLONS).val(), $(GALLONSFREQ).val(), 
      $(GASCOST).val(), $(DOLLARS).val(), $(DOLLARFREQ).val(), 
      $(MPG).val(), $(MILES).val(), $(MILEAGEFREQ).val());

    model.setAir($(SEATMILES).val());

    billSplitStatus = $("input[name=billSplitStatus]:checked");
    approxOrExactStatus = $("input[name=approxOrExactStatus]:checked");
    heating = $("input[name=heating]:checked");
    homeObject = {};
    homeObject.percentSplit = $(PERCENTSPLIT).val();
    homeObject.zipcode = $(ZIPCODE).val();
    homeObject.utility = $(UTILITIES).val();
    $(UTILITYREMEMBERED).val(homeObject.utility);
    homeObject.percentOfAverage = $(PERCENTOFAVERAGE).val();
    homeObject.therms = $(THERMS).val();
    homeObject.gallons = $(FUELOIL).val();
    homeObject.elec = $(KWH).val();


    model.setHome(parseInt(billSplitStatus.val()), parseInt(approxOrExactStatus.val()), parseInt(heating.val()), homeObject);

    model.setSummary();
  }

  // function updateCurrentPage() {
  //   $(PAGEREMEMBERED).val($('.nav-tabs > .active').find('a')[0].hash);

  // }

  function updateGeneral() {
    updateModel();
    updateBoxesAndSpans();
    console.log(model.errorCount);
    if (model.errorCount > 0) {
      // updateCurrentPage();
      return 0;
    }
    return 1;
    // if (model.errorCount > prevErrorCount) {
    //   prevErrorCount = model.errorCount;
    //   return 0;
    // }
    // prevErrorCount = model.errorCount;
    // return 1;
  }

  $(".next_button").on("click", 
    function () {
      $('.nav-tabs > .active').next('li').find('a').trigger('click');
      
    }
  );

  $(".prev_button").on("click", 
    function () {
      $('.nav-tabs > .active').prev('li').find('a').trigger('click');
    }
  );

  $('#skip_to_5').on("click", 
    function () {
      status = updateGeneral();
      if (parseInt(status)) {
        $('#wizard_tab_nav a[href="#gas_page"]').tab('show');
      }
      console.log($('.nav-tabs > .active'));
    }
  );

  $("a[role=tab]").on("click", 
    function (event) {
      status = updateGeneral();
      if (!parseInt(status)) {
        alert("We were unable to process some of the information you entered. Please fix the red highlighted fields or refresh the page and start over, in order to receive meaningful results from the calculator");
        event.stopPropagation(); //stop the click event from executing after pressing OK on the alert
      }
      
    }
  );

  $("#submitZipcode").on("click", 
    function () {
      status = updateGeneral();
      $("#utilityBlock").show();
      $(UTILITYREMEMBERED).val("");
      updateUtilities();
    
      
    }
  );

  $(UTILITIES).on("change", 
    function () {
      $(UTILITYREMEMBERED).val($(UTILITIES).val());
      status = updateGeneral();
    }
  );

  $("#submitSplit").on("click",
    function(){
      
      status = updateGeneral();
      
      $("#electricBlock").show();
    
    
    }
  );

  $("#submitUtility").on("click",
    function(){
      $("#approxOrExact").show();
      updateGeneral();
    
    }
  );

  // $("input[type=radio]").on("click", 
  //   function () {
  //     status = updateGeneral();
      
  //   }
  // );

  

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //     View
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function updateRadios() {
    updateGeneral();
    if (parseInt($("input[name=taxOption]:checked").val()) == 0) {
      $("#updated_taxes").hide();
    } else {
      $("#updated_taxes").show();
    }

    if (parseInt($("input[name=eitcOption]:checked").val()) == 0) {
      $("#updated_eitc").hide();
    } else {
      $("#updated_eitc").show();
    }

    if (parseInt($("input[name=gas]:checked").val()) == 0) {
      $("#gasOptionOne").show();
      $("#gasOptionTwo").hide();
      $("#gasOptionThree").hide();
    } else if (parseInt($("input[name=gas]:checked").val()) == 1) {
      $("#gasOptionTwo").show();
      $("#gasOptionOne").hide();
      $("#gasOptionThree").hide();
    } else {
      $("#gasOptionThree").show();
      $("#gasOptionOne").hide();
      $("#gasOptionTwo").hide();
    }
    
    if ($("input[name=billSplitStatus]:checked").length > 0) {
      if (parseInt($("input[name=billSplitStatus]:checked").val()) == 0) {
        $("#partialEnergy").show();
      } else {
        $("#partialEnergy").hide();
        $("#electricBlock").show();
      }
    }

    if ($("input[name=approxOrExactStatus]:checked").length > 0) { 
      $("#electricBlock").show();
      $("#utilityBlock").show();
      $("#approxOrExact").show();

      if (parseInt($("input[name=approxOrExactStatus]:checked").val()) == 0) {
        $("#energyUsage").show();
        $("#approxEnergyDiv").hide();
      } else {
        $("#approxEnergyDiv").show();
        $("#approxEnergy").show();
        $("#energyUsage").hide();
      }
    }

    if ($("input[name=heating]:checked").length > 0) { 
      $("#approxPercentage").show();
    }

  }

  function setBox(element, value, error, errorMsg) {
    if (error == false) {
      $(element).prop("title", "");
      $(element).css("background-color", "white");
      $(element).uitooltip({ content: "" });
      $(element).val(value);
    } else {
      $(element).val(value);
      $(element).prop("title", errorMsg);
      $(element).css("background-color", "#FFCCCC");
      $(element).uitooltip();

    }
  }

  function updateBoxesAndSpans() {
    setBox(INCOME, model.income, model.error.income, model.errorMsg.income);
    setBox(SALESTAXPAYMENTMANUAL, model.salesTax.manualTaxes, model.error.salesTax, model.errorMsg.salesTax);
    //$(SALESTAXPAYMENTMANUAL).val(model.salesTax.manualTaxes);
    $(SALESTAXPAYMENTAUTO).text(model.salesTax.autoTaxes);
    $(EITCAUTO).text(model.wfr.autoEitc);
    setBox(EITCMANUAL, model.wfr.manualEitc, model.error.wfr, model.errorMsg.wfr);
    //$(EITCMANUAL).val(model.wfr.manualEitc);
    setBox(GALLONS, model.gas.gallons, model.error.gallons, model.errorMsg.gas);
    //$(GALLONS).val(model.gas.gallons);
    setBox(GASCOST, model.gas.perGallonCost, model.error.gasCost, model.errorMsg.gas);
    setBox(DOLLARS, model.gas.spending, model.error.dollars, model.errorMsg.gas);
    //$(GASCOST).val(model.gas.perGallonCost);
    //$(DOLLARS).val(model.gas.spending);
    setBox(MPG, model.gas.mpg, model.error.mpg, model.errorMsg.gas);
    setBox(MILES, model.gas.mileage, model.error.miles, model.errorMsg.gas);
    //$(MPG).val(model.gas.mpg);
    //$(MILES).val(model.gas.mileage);
    setBox(SEATMILES, model.air.miles, model.error.air, model.errorMsg.air);
    //$(SEATMILES).val(model.air.miles);
    if (model.home.splitYes) {
      setBox(PERCENTSPLIT, model.home.splitPercentage, model.error.splitPercentage, model.errorMsg.generic);
    }
    setBox(ZIPCODE, model.home.zipcode, model.error.zipcode, model.errorMsg.generic);
    setBox(PERCENTOFAVERAGE, model.home.energyApproxPercent, model.error.energyApproxPercent, model.errorMsg.generic);
    setBox(THERMS, model.home.therms, model.error.therms, model.errorMsg.generic);
    setBox(FUELOIL, model.home.gallons, model.error.fuelOil, model.errorMsg.generic);
    setBox(KWH, model.home.kwh, model.error.elec, model.errorMsg.generic);
    //$(PERCENTSPLIT).val(model.home.splitPercentage);
    //$(ZIPCODE).val(model.home.zipcode);
    //$(PERCENTOFAVERAGE).val(model.home.energyApproxPercent);
    //$(THERMS).val(model.home.therms);
    //$(FUELOIL).val(model.home.gallons);
    //$(KWH).val(model.home.kwh);
    $(INCOMEWFR).text(model.income);
    $(SALESTAXSAVINGS).text(model.salesTax.savings);
    $(WFRSAVINGS).text(model.wfr.savings);
    $(GASTAXES).text(model.gas.taxes);
    $(AIRTAXES).text(model.air.taxes);
    $(NATGASTAXES).text(model.home.natGasTaxes);
    $(FUELOILTAXES).text(model.home.fuelOilTaxes);
    $(ELECTAXES).text(model.home.elecTaxes);
    $(HOMETAXES).text(model.home.totalTaxes);
    $(TOTALSAVINGS).text(model.total.savings);
    $(TOTALCOSTS).text(model.total.taxes);
    $(TOTALNET).text(model.total.net);
    if (model.total.savings > model.total.taxes) {
      $("#final_summary").text("save");
    } else if (model.total.savings < model.total.taxes) {
      $("#final_summary").text("spend");
    } else {
      $("#final_summary").text("spend");
    }
    
  }

  function updateUtilities() {
    zipcode = $(ZIPCODE).val();
    utilities = getUtilities(zipcode);
    $(UTILITIES).empty();
    if (utilities != 0) {
      for (var i = 0; i < 5; i ++) {
        if (utilities[i].length > 0) {
          var utilityStats = getUtilityStats(utilities[i]);
          $(UTILITIES).append($('<option>').text(utilityStats[0]).attr('value', utilities[i]));
        }
      }
      
      if ($(UTILITYREMEMBERED).val().length == 0) {
        $(UTILITIES).val(utilities[0]);
      } else {
        $(UTILITIES).val($(UTILITYREMEMBERED).val());
      }
    }
  }
  
}
);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     Model
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function tryMakeValidNumber(num, decimalLen) {
  value = String(num).replace(",", "").replace("%", "").replace("$", "");
  if (isNumber(value)) {
    return parseFloat(parseFloat(value).toFixed(decimalLen));
  } else {
    return num;
  }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isZipcode(zip) {
  if (getUtilities(zip) != 0) {
    return true;
  } else {
    return false;
  }
}

function tryMakeValidZipcode(value) {
  value = String(value).replace(",", "").replace("%", "").replace("$", "").replace(".", "").substring(0, 5);
  return parseInt(value);
}

function Model() {
  this.income = 0;

  this.salesTax = {};
  this.salesTax.savings = 0;
  this.salesTax.autoSelected = true;
  this.salesTax.autoTaxes = 0;
  this.salesTax.manualTaxes = 0;

  this.wfr = {};
  this.wfr.savings = 0;
  this.wfr.autoSelected = true;
  this.wfr.autoEitc = 0;
  this.wfr.manualEitc = 0;
  this.wfr.dependents = 0;
  this.wfr.marriedJoint = null;

  this.gas = {};
  this.gas.taxes = 0;
  this.gas.radioSelection = 0;
  this.gas.gallons = 0;
  this.gas.gallonsFreq = 52;
  this.gas.spending = 0;
  this.gas.perGallonCost = 2.40;
  this.gas.spendingFreq = 52;
  this.gas.mileage = 0;
  this.gas.mpg = 30;
  this.gas.mileageFreq = 52;

  this.air = {};
  this.air.taxes = 0;
  this.air.miles = 0;

  this.home = {};
  this.home.natGasTaxes = 0;
  this.home.fuelOilTaxes = 0;
  this.home.elecTaxes = 0;
  this.home.totalTaxes = 0;
  this.home.splitYes = null;
  this.home.splitPercentage = 100;
  this.home.zipcode = 98328;
  this.home.utility = "PSE";
  this.home.energyExact = null;
  this.home.therms = 0;
  this.home.gallons = 0;
  this.home.kwh = 0;
  this.home.heatingSelect = 0;
  this.home.energyApproxPercent = 100;

  this.total = {};
  this.total.savings = 0;
  this.total.taxes = 0;
  this.total.net = 0;

  this.errorCount = 0;

  this.error = {
    income: false,
    salesTax: false,
    wfr: false,
    gallons: false,
    gasCost: false,
    dollars: false, 
    mpg: false,
    miles: false,
    air: false,
    splitPercentage: false, 
    zipcode: false,
    therms: false,
    fuelOil: false,
    elec: false,
    energyApproxPercent: false
  }

  this.errorMsg = {
    income: "Please enter a valid income", 
    salesTax: "Please enter a valid sales tax amount",
    wfr: "Please enter a valid EITC amount", 
    gas: "Please enter a valid number",
    air: "Please enter a valid number of miles", 
    generic: "Please enter valid data"
  }

}

Model.prototype.setNumberError = function(val, err) {
  if (isNumber(val)) {
    if (err) {
      this.errorCount = this.errorCount - 1;
    }
    return false;
  } else {
    if (!err) {
      this.errorCount = this.errorCount + 1;
    }
    return true;
  }
}

Model.prototype.setZipcodeError = function(val, err) {
  if (isZipcode(val)) {
    if (err) {
      this.errorCount = this.errorCount - 1;
    }
    return false;
  } else {
    if (!err) {
      this.errorCount = this.errorCount + 1;
    }
    return true;
  }
}

Model.prototype.setIncome = function(income) {
  this.income = tryMakeValidNumber(income, 2);
  this.error.income = this.setNumberError(this.income, this.error.income);
}

Model.prototype.setSalesTax = function(taxOption, salesTaxManual){
  taxOption = parseInt(taxOption);
  
  this.salesTax.autoTaxes = Math.round(121.59*Math.pow(0.001*this.income, 0.6919));
  this.salesTax.manualTaxes = tryMakeValidNumber(salesTaxManual, 0);

  if (taxOption == 0) {
    this.salesTax.autoSelected = true;
    this.error.salesTax = this.setNumberError(0, this.error.salesTax);
    this.salesTax.savings = Math.round(this.salesTax.autoTaxes/8.95);
  } else {
    this.salesTax.autoSelected = false;
    this.error.salesTax = this.setNumberError(this.salesTax.manualTaxes, this.error.salesTax);
    this.salesTax.savings = Math.round(this.salesTax.manualTaxes/8.95);
  }
  
}

Model.prototype.setEitc = function(dependents, taxStatus){
  var rate = 0;
  var maxCred = 0;
  var phaseOut = 0;
  var phaseOutIncome = 0;
  var eitcEstimate = 0;

  dependents = parseInt(dependents);

  switch (dependents) {
    case 0:
      rate = 0.0765;
      maxCred = 496;
      phaseOut = 0.0765;
      phaseOutIncome = 8110;
      break; 
    case 1:
      rate = 0.34;
      maxCred = 3305;
      phaseOut = 0.1598;
      phaseOutIncome = 17830;
      break; 
    case 2:
      rate = 0.4;
      maxCred = 5460;
      phaseOut = 0.2106;
      phaseOutIncome = 17830;
      break; 
    case 3:
      rate = 0.45;
      maxCred = 6143;
      phaseOut = 0.2106;
      phaseOutIncome = 17830;
      break; 
    default: 
      rate = 0.45;
      maxCred = 6143;
      phaseOut = 0.2106;
      phaseOutIncome = 17830;
  }

  if (taxStatus == 0) {
    phaseOutIncome = phaseOutIncome + 5430;
  }

  eitcEstimate = Math.min(maxCred, rate*this.income);

  if (this.income > phaseOutIncome) {
    eitcEstimate = eitcEstimate - phaseOut*(this.income - phaseOutIncome);
  }

  eitcEstimate = Math.max(eitcEstimate, 0);

  if (taxStatus == null || isNaN(taxStatus)) {
    eitcEstimate = 0;
  }
  
  this.wfr.marriedJoint = taxStatus;
  this.wfr.dependents = dependents;
  this.wfr.autoEitc = Math.round(eitcEstimate);
}

Model.prototype.setWfr = function(eitcOption, eitcManual){
  this.wfr.manualEitc = tryMakeValidNumber(eitcManual, 0);

  if (eitcOption == 0) {
    this.wfr.autoSelected == true;
    this.error.wfr = this.setNumberError(0, this.error.wfr);
    this.wfr.savings = Math.round(0.25 * this.wfr.autoEitc);
  } else {
    this.wfr.autoSelected == false;
    this.error.wfr = this.setNumberError(this.wfr.manualEitc, this.error.wfr);
    this.wfr.savings = Math.round(0.25 * this.wfr.manualEitc);
  }
}

Model.prototype.setGas = function(gasOption, gallons, gallonsFreq, gasCost, dollars, dollarFreq, mpg, miles, mileageFreq){
  this.gas.gallons = tryMakeValidNumber(gallons, 2);
  this.gas.spending = tryMakeValidNumber(dollars, 2);
  this.gas.perGallonCost = tryMakeValidNumber(gasCost, 2);
  this.gas.mileage = tryMakeValidNumber(miles, 0);
  this.gas.mpg = tryMakeValidNumber(mpg, 0);

  if (gasOption == 0) {
    gasTaxes = Math.round(this.gas.gallons*gallonsFreq*8.91/1000*25);
    this.error.gallons = this.setNumberError(this.gas.gallons, this.error.gallons);
  } else if (gasOption == 1) {
    gasTaxes = Math.round(this.gas.spending/this.gas.perGallonCost*dollarFreq*8.91/1000*25);
    this.error.gasCost = this.setNumberError(this.gas.perGallonCost, this.error.gasCost);
    this.error.dollars = this.setNumberError(this.gas.spending, this.error.dollars);

  } else {
    gasTaxes = Math.round(this.gas.mileage/this.gas.mpg*mileageFreq*8.91/1000*25);
    this.error.mpg = this.setNumberError(this.gas.mpg, this.error.mpg);
    this.error.miles = this.setNumberError(this.gas.mileage, this.error.miles);

  }

  this.gas.taxes = gasTaxes;
  this.gas.radioSelection = gasOption;
  this.gas.gallonsFreq = gallonsFreq;
  this.gas.spendingFreq = dollarFreq;
  this.gas.mileageFreq = mileageFreq;
}

Model.prototype.setAir = function(seatMiles){
  this.air.miles = tryMakeValidNumber(seatMiles, 0);
  airTaxes = Math.round(this.air.miles/60*9.57/1000*25);
  this.error.air = this.setNumberError(this.air.miles, this.error.air);

  this.air.taxes = airTaxes;
  
}

Model.prototype.setHome = function(billSplitStatus, approxOrExactStatus, heating, homeObject){
  this.home.splitPercentage = tryMakeValidNumber(homeObject.percentSplit, 0);
  if (billSplitStatus == 0) {
    this.error.splitPercentage = this.setNumberError(this.home.splitPercentage, this.error.splitPercentage);
  }
  this.home.zipcode = tryMakeValidZipcode(homeObject.zipcode);
  this.error.zipcode = this.setZipcodeError(this.home.zipcode, this.error.zipcode);
  this.home.therms = tryMakeValidNumber(homeObject.therms, 0);
  this.home.gallons = tryMakeValidNumber(homeObject.gallons, 0);
  this.home.kwh = tryMakeValidNumber(homeObject.elec, 0);
  this.home.energyApproxPercent = tryMakeValidNumber(homeObject.percentOfAverage, 0);
  if (approxOrExactStatus == 0) {
    this.error.therms = this.setNumberError(this.home.therms, this.error.therms);
    this.error.fuelOil = this.setNumberError(this.home.gallons, this.error.fuelOil);
    this.error.elec = this.setNumberError(this.home.kwh, this.error.elec);
  } else if (approxOrExactStatus == 1) {
    this.error.energyApproxPercent = this.setNumberError(this.home.energyApproxPercent, this.error.energyApproxPercent);
  }
  
  if (!isNaN(billSplitStatus) && !isNaN(approxOrExactStatus) && !(approxOrExactStatus == 1 && isNaN(heating))) {

    if (billSplitStatus == 0) {
      this.home.splitYes = true;      
    } else {
      this.home.splitYes = false;
      this.home.splitPercentage = 100;
    }

    if (approxOrExactStatus == 0) {
      this.home.natGasTaxes = Math.round(5.306*25*this.home.therms/1000*this.home.splitPercentage/100);
    } else {
      if (heating == 0 || heating == 4) {
        this.home.natGasTaxes = Math.round(5.306*25*732/1000*this.home.energyApproxPercent/100*this.home.splitPercentage/100);
      } else {
        this.home.natGasTaxes = 0;
      }
    }

    if (approxOrExactStatus == 0) {
      this.home.fuelOilTaxes = Math.round(10.15*25*this.home.gallons/1000*this.home.splitPercentage/100);
    } else {
      if (heating == 1) {
        this.home.fuelOilTaxes = Math.round(10.15*25*527/1000*this.home.energyApproxPercent/100*this.home.splitPercentage/100);
      } else {
        this.home.fuelOilTaxes = 0;
      }
    }

    if (homeObject.utility != null) {
      centsPerKwh = getUtilityStats(homeObject.utility)[1];

      if (approxOrExactStatus == 0) {
        this.home.elecTaxes = Math.round(centsPerKwh*this.home.kwh/100*this.home.splitPercentage/100);
      } else {
        if (heating == 2) {
          this.home.elecTaxes = Math.round(centsPerKwh*(11000 + 11360)/100*this.home.energyApproxPercent/100*this.home.splitPercentage/100);
        } else {
          this.home.elecTaxes = Math.round(centsPerKwh*(11000)/100*this.home.energyApproxPercent/100*this.home.splitPercentage/100);
        }
      }
    }

    
  }

  this.home.totalTaxes = Math.round(this.home.natGasTaxes + this.home.fuelOilTaxes + this.home.elecTaxes);
  if (billSplitStatus == 0) {
    this.home.splitYes = true;
  } else {
    this.home.splitYes = false;
  }
  //this.home.splitPercentage = homeObject.percentSplit;
  //this.home.zipcode = homeObject.zipcode;
  this.home.utility = homeObject.utility;
  if (approxOrExactStatus == 0) {
    this.home.energyExact = true;
  } else {
    this.home.energyExact = false;
  }
  //this.home.therms = homeObject.therms;
  //this.home.gallons = homeObject.gallons;
  //this.home.kwh = homeObject.elec;
  this.home.heatingSelect = heating;
  //this.home.energyApproxPercent = homeObject.percentOfAverage;
}

Model.prototype.setSummary = function(){
  this.total.savings = this.salesTax.savings + this.wfr.savings;
  this.total.taxes = this.gas.taxes + this.air.taxes + this.home.totalTaxes;
  this.total.net = Math.abs(this.total.savings - this.total.taxes);
}

function inheritPrototype(childObject, parentObject) {
  var copyOfParent = Object.create(parentObject.prototype);
  copyOfParent.constructor = childObject;
  childObject.prototype = copyOfParent;
}

function getUtilities(zipcode) {
  zipcode = parseInt(zipcode);
  var utilityArray = 
  [
      [98001,"PSE","","","",""  ],
      [98002,"PSE","","","",""  ],
      [98003,"PSE","Milton","","",""  ],
      [98004,"PSE","","","",""  ],
      [98005,"PSE","","","",""  ],
      [98006,"PSE","","","",""  ],
      [98007,"PSE","","","",""  ],
      [98008,"PSE","","","",""  ],
      [98009,"PSE","","","",""  ],
      [98010,"PSE","","","",""  ],
      [98011,"PSE","","","",""  ],
      [98012,"Sno","","","",""  ],
      [98014,"PSE","Tanner","","",""  ],
      [98019,"PSE","","","",""  ],
      [98020,"Sno","","","",""  ],
      [98021,"Sno","","","",""  ],
      [98022,"PSE","","","",""  ],
      [98023,"PSE","Tacoma","","",""  ],
      [98024,"PSE","Tanner","","",""  ],
      [98026,"Sno","","","",""  ],
      [98027,"PSE","","","",""  ],
      [98028,"PSE","","","",""  ],
      [98029,"PSE","","","",""  ],
      [98030,"PSE","","","",""  ],
      [98031,"PSE","","","",""  ],
      [98032,"PSE","","","",""  ],
      [98033,"PSE","","","",""  ],
      [98034,"PSE","","","",""  ],
      [98035,"PSE","","","",""  ],
      [98036,"Sno","","","",""  ],
      [98037,"Sno","","","",""  ],
      [98038,"PSE","","","",""  ],
      [98039,"PSE","","","",""  ],
      [98040,"PSE","","","",""  ],
      [98041,"PSE","","","",""  ],
      [98042,"PSE","","","",""  ],
      [98043,"Sno","","","",""  ],
      [98045,"PSE","Tanner","","",""  ],
      [98046,"Sno","","","",""  ],
      [98047,"PSE","","","",""  ],
      [98050,"PSE","","","",""  ],
      [98051,"PSE","","","",""  ],
      [98052,"PSE","Sno","","",""  ],
      [98053,"PSE","Tanner","","",""  ],
      [98055,"PSE","","","",""  ],
      [98056,"PSE","","","",""  ],
      [98057,"PSE","SCL","","",""  ],
      [98058,"PSE","","","",""  ],
      [98059,"PSE","","","",""  ],
      [98065,"PSE","Tanner","","",""  ],
      [98068,"PSE","","","",""  ],
      [98070,"PSE","","","",""  ],
      [98072,"PSE","Sno","","",""  ],
      [98074,"PSE","Tanner","","",""  ],
      [98075,"PSE","","","",""  ],
      [98077,"PSE","Sno","","",""  ],
      [98087,"Sno","","","",""  ],
      [98092,"PSE","","","",""  ],
      [98101,"SCL","","","",""  ],
      [98102,"SCL","","","",""  ],
      [98103,"SCL","","","",""  ],
      [98104,"SCL","","","",""  ],
      [98105,"SCL","","","",""  ],
      [98106,"SCL","","","",""  ],
      [98107,"SCL","","","",""  ],
      [98108,"SCL","","","",""  ],
      [98109,"SCL","","","",""  ],
      [98110,"PSE","","","",""  ],
      [98112,"SCL","","","",""  ],
      [98115,"SCL","","","",""  ],
      [98116,"SCL","","","",""  ],
      [98117,"SCL","","","",""  ],
      [98118,"SCL","","","",""  ],
      [98119,"SCL","","","",""  ],
      [98121,"SCL","","","",""  ],
      [98122,"SCL","","","",""  ],
      [98125,"SCL","","","",""  ],
      [98126,"SCL","","","",""  ],
      [98129,"SCL","","","",""  ],
      [98131,"SCL","","","",""  ],
      [98132,"SCL","","","",""  ],
      [98133,"SCL","","","",""  ],
      [98134,"SCL","","","",""  ],
      [98136,"SCL","","","",""  ],
      [98144,"SCL","","","",""  ],
      [98146,"SCL","","","",""  ],
      [98148,"PSE","SCL","","",""  ],
      [98154,"SCL","","","",""  ],
      [98155,"SCL","","","",""  ],
      [98160,"SCL","","","",""  ],
      [98161,"SCL","","","",""  ],
      [98164,"SCL","","","",""  ],
      [98166,"PSE","SCL","","",""  ],
      [98168,"SCL","","","",""  ],
      [98171,"SCL","","","",""  ],
      [98174,"SCL","","","",""  ],
      [98177,"SCL","","","",""  ],
      [98178,"SCL","","","",""  ],
      [98188,"PSE","SCL","","",""  ],
      [98195,"SCL","","","",""  ],
      [98198,"PSE","","","",""  ],
      [98199,"SCL","","","",""  ],
      [98201,"Sno","","","",""  ],
      [98203,"Sno","","","",""  ],
      [98204,"Sno","","","",""  ],
      [98205,"Sno","","","",""  ],
      [98207,"Sno","","","",""  ],
      [98208,"Sno","","","",""  ],
      [98220,"PSE","","","",""  ],
      [98221,"PSE","","","",""  ],
      [98222,"Opalco","","","",""  ],
      [98223,"Sno","","","",""  ],
      [98224,"PSE","","","",""  ],
      [98225,"PSE","","","",""  ],
      [98226,"PSE","","","",""  ],
      [98229,"PSE","","","",""  ],
      [98230,"Blaine","PSE","","",""  ],
      [98232,"PSE","","","",""  ],
      [98233,"PSE","","","",""  ],
      [98235,"PSE","","","",""  ],
      [98236,"PSE","","","",""  ],
      [98237,"PSE","","","",""  ],
      [98238,"PSE","","","",""  ],
      [98239,"PSE","","","",""  ],
      [98240,"PSE","","","",""  ],
      [98241,"Sno","PSE","","",""  ],
      [98243,"Opalco","","","",""  ],
      [98244,"PSE","","","",""  ],
      [98245,"Opalco","","","",""  ],
      [98247,"PSE","","","",""  ],
      [98248,"PSE","Whatcom","","",""  ],
      [98249,"PSE","","","",""  ],
      [98250,"Opalco","","","",""  ],
      [98251,"PSE","Sno","","",""  ],
      [98252,"Sno","","","",""  ],
      [98253,"PSE","","","",""  ],
      [98255,"PSE","","","",""  ],
      [98256,"Sno","","","",""  ],
      [98257,"PSE","","","",""  ],
      [98258,"Sno","","","",""  ],
      [98260,"PSE","","","",""  ],
      [98261,"Opalco","","","",""  ],
      [98262,"PSE","","","",""  ],
      [98263,"PSE","","","",""  ],
      [98264,"PSE","","","",""  ],
      [98266,"PSE","","","",""  ],
      [98267,"PSE","","","",""  ],
      [98270,"Sno","","","",""  ],
      [98271,"Sno","","","",""  ],
      [98272,"Sno","","","",""  ],
      [98273,"PSE","","","",""  ],
      [98274,"PSE","","","",""  ],
      [98275,"Sno","","","",""  ],
      [98276,"PSE","","","",""  ],
      [98277,"PSE","","","",""  ],
      [98278,"PSE","","","",""  ],
      [98279,"Opalco","","","",""  ],
      [98280,"Opalco","","","",""  ],
      [98281,"PSE","","","",""  ],
      [98282,"Sno","","","",""  ],
      [98283,"PSE","","","",""  ],
      [98284,"PSE","","","",""  ],
      [98286,"Opalco","","","",""  ],
      [98287,"Sno","","","",""  ],
      [98288,"PSE","","","",""  ],
      [98290,"Sno","","","",""  ],
      [98292,"Sno","PSE","","",""  ],
      [98294,"Sno","","","",""  ],
      [98295,"Sumas","PSE","","",""  ],
      [98296,"Sno","","","",""  ],
      [98297,"Opalco","","","",""  ],
      [98303,"Tanner","","","",""  ],
      [98304,"Lewis","PSE","","",""  ],
      [98305,"Clallam","","","",""  ],
      [98310,"PSE","","","",""  ],
      [98311,"PSE","","","",""  ],
      [98312,"PSE","Mason3","","",""  ],
      [98314,"PSE","","","",""  ],
      [98315,"PSE","","","",""  ],
      [98320,"Mason3","Mason1","Jefferson","",""  ],
      [98321,"PSE","","","",""  ],
      [98323,"PSE","","","",""  ],
      [98325,"Jefferson","","","",""  ],
      [98326,"Clallam","","","",""  ],
      [98327,"PSE","","","",""  ],
      [98328,"Tacoma","PSE","Ohop","Alder","Eaton"  ],
      [98329,"Peninsula","PSE","","",""  ],
      [98330,"PSE","Lewis","","",""  ],
      [98331,"Clallam","Grays","Jefferson","",""  ],
      [98332,"Peninsula","","","",""  ],
      [98333,"Peninsula","","","",""  ],
      [98335,"Peninsula","","","",""  ],
      [98336,"Lewis","","","",""  ],
      [98337,"PSE","","","",""  ],
      [98338,"Tacoma","PSE","Ohop","",""  ],
      [98339,"PSE","Jefferson","","",""  ],
      [98340,"PSE","","","",""  ],
      [98342,"PSE","","","",""  ],
      [98345,"PSE","","","",""  ],
      [98346,"PSE","","","",""  ],
      [98349,"Peninsula","","","",""  ],
      [98350,"Clallam","","","",""  ],
      [98351,"Peninsula","","","",""  ],
      [98353,"PSE","","","",""  ],
      [98354,"Milton","","","",""  ],
      [98355,"Lewis","","","",""  ],
      [98356,"Lewis","","","",""  ],
      [98357,"Clallam","","","",""  ],
      [98358,"PSE","Jefferson","","",""  ],
      [98359,"PSE","","","",""  ],
      [98360,"PSE","Tacoma","","",""  ],
      [98361,"Lewis","","","",""  ],
      [98362,"Clallam","PortAng","","",""  ],
      [98363,"Clallam","PortAng","","",""  ],
      [98364,"PSE","","","",""  ],
      [98365,"PSE","Jefferson","","",""  ],
      [98366,"PSE","","","",""  ],
      [98367,"PSE","Mason3","","",""  ],
      [98368,"PSE","Jefferson","","",""  ],
      [98370,"PSE","","","",""  ],
      [98371,"Tacoma","PSE","Milton","",""  ],
      [98372,"PSE","","","",""  ],
      [98373,"Tacoma","PSE","Elmhurst","",""  ],
      [98374,"Tacoma","PSE","","",""  ],
      [98375,"Tacoma","PSE","Elmhurst","",""  ],
      [98376,"PSE","Jefferson","","",""  ],
      [98377,"Lewis","","","",""  ],
      [98380,"PSE","Mason3","","",""  ],
      [98381,"Clallam","","","",""  ],
      [98382,"Clallam","Jefferson","","",""  ],
      [98383,"PSE","","","",""  ],
      [98385,"PSE","","","",""  ],
      [98387,"Tacoma","PSE","Ohop","Elmhurst",""  ],
      [98388,"Steilacoom","Tacoma","PSE","",""  ],
      [98390,"PSE","","","",""  ],
      [98391,"PSE","","","",""  ],
      [98392,"PSE","","","",""  ],
      [98393,"PSE","","","",""  ],
      [98394,"Peninsula","","","",""  ],
      [98396,"PSE","","","",""  ],
      [98402,"Tacoma","","","",""  ],
      [98403,"Tacoma","","","",""  ],
      [98404,"Tacoma","","","",""  ],
      [98405,"Tacoma","","","",""  ],
      [98406,"Tacoma","","","",""  ],
      [98407,"Tacoma","Ruston","","",""  ],
      [98408,"Tacoma","","","",""  ],
      [98409,"Tacoma","","","",""  ],
      [98413,"Tacoma","","","",""  ],
      [98416,"Tacoma","","","",""  ],
      [98418,"Tacoma","","","",""  ],
      [98421,"Tacoma","","","",""  ],
      [98422,"Tacoma","Milton","","",""  ],
      [98424,"Tacoma","PSE","Milton","",""  ],
      [98430,"PSE","","","",""  ],
      [98433,"Tacoma","PSE","","",""  ],
      [98438,"Tacoma","PSE","","",""  ],
      [98439,"PSE","","","",""  ],
      [98442,"Tacoma","","","",""  ],
      [98443,"Tacoma","","","",""  ],
      [98444,"Tacoma","PSE","Parkland","Elmhurst","Lakeview"  ],
      [98445,"Tacoma","PSE","Parkland","Elmhurst",""  ],
      [98446,"Tacoma","PSE","Elmhurst","",""  ],
      [98447,"Parkland","","","",""  ],
      [98465,"Tacoma","","","",""  ],
      [98466,"Tacoma","","","",""  ],
      [98467,"Tacoma","Lakeview","","",""  ],
      [98492,"Tacoma","","","",""  ],
      [98498,"Tacoma","PSE","Lakeview","Steilacoom",""  ],
      [98499,"Tacoma","PSE","Lakeview","",""  ],
      [98501,"PSE","","","",""  ],
      [98502,"PSE","Mason3","Grays","",""  ],
      [98503,"PSE","","","",""  ],
      [98506,"PSE","","","",""  ],
      [98512,"PSE","","","",""  ],
      [98513,"PSE","","","",""  ],
      [98516,"PSE","","","",""  ],
      [98520,"Grays","","","",""  ],
      [98524,"Mason3","","","",""  ],
      [98526,"Grays","","","",""  ],
      [98527,"PacificPUD","","","",""  ],
      [98528,"Mason3","Peninsula","","",""  ],
      [98530,"PSE","","","",""  ],
      [98531,"Lewis","Centralia","PSE","",""  ],
      [98532,"Lewis","PacificPUD","Centralia","",""  ],
      [98533,"Lewis","","","",""  ],
      [98535,"Grays","","","",""  ],
      [98536,"Grays","","","",""  ],
      [98537,"Grays","PacificPUD","Lewis","",""  ],
      [98538,"Lewis","","","",""  ],
      [98541,"Mason3","Grays","","",""  ],
      [98542,"Lewis","","","",""  ],
      [98544,"Lewis","","","",""  ],
      [98546,"Mason1","Mason3","","",""  ],
      [98547,"Grays","PacificPUD","","",""  ],
      [98548,"Mason1","Mason3","","",""  ],
      [98550,"Grays","","","",""  ],
      [98552,"Grays","","","",""  ],
      [98555,"Mason1","Mason3","","",""  ],
      [98557,"McCleary","Grays","","",""  ],
      [98558,"PSE","","","",""  ],
      [98559,"Grays","","","",""  ],
      [98560,"Mason3","Grays","","",""  ],
      [98562,"Grays","","","",""  ],
      [98563,"Grays","Mason3","","",""  ],
      [98564,"Lewis","Cowlitz","","",""  ],
      [98565,"Lewis","","","",""  ],
      [98568,"Grays","Lewis","PacificPUD","",""  ],
      [98569,"Grays","","","",""  ],
      [98570,"Lewis","","","",""  ],
      [98571,"Grays","","","",""  ],
      [98572,"Lewis","PacificPUD","Cowlitz","Wah",""  ],
      [98575,"Grays","Mason3","","",""  ],
      [98576,"PSE","","","",""  ],
      [98577,"PacificPUD","Lewis","Grays","",""  ],
      [98579,"PSE","Lewis","Grays","",""  ],
      [98580,"PSE","Tacoma","Parkland","Ohop","Elmhurst"  ],
      [98581,"Cowlitz","Lewis","Wah","",""  ],
      [98582,"Lewis","","","",""  ],
      [98583,"Grays","","","",""  ],
      [98584,"Mason1","Mason3","Grays","",""  ],
      [98585,"Lewis","","","",""  ],
      [98586,"PacificPUD","","","",""  ],
      [98587,"Grays","","","",""  ],
      [98588,"Mason3","Mason1","","",""  ],
      [98589,"PSE","","","",""  ],
      [98590,"Grays","PacificPUD","","",""  ],
      [98591,"Lewis","","","",""  ],
      [98592,"Mason1","Mason3","","",""  ],
      [98593,"Lewis","","","",""  ],
      [98595,"Grays","Cowlitz","","",""  ],
      [98596,"Lewis","","","",""  ],
      [98597,"PSE","Cowlitz","Tacoma","Lewis","Alder"  ],
      [98601,"Clark","Cowlitz","","",""  ],
      [98602,"Klick","","","",""  ],
      [98603,"Cowlitz","Clark","","",""  ],
      [98604,"Clark","","","",""  ],
      [98605,"Skam","Klick","","",""  ],
      [98606,"Clark","","","",""  ],
      [98607,"Clark","","","",""  ],
      [98609,"Cowlitz","","","",""  ],
      [98610,"Skam","","","",""  ],
      [98611,"Cowlitz","Lewis","","",""  ],
      [98612,"Wah","Cowlitz","","",""  ],
      [98613,"Klick","Skam","BREA","PacifiCorp",""  ],
      [98614,"PacificPUD","","","",""  ],
      [98616,"Cowlitz","Skam","Clark","",""  ],
      [98617,"Klick","","","",""  ],
      [98619,"Klick","Yakama","","",""  ],
      [98620,"Klick","","","",""  ],
      [98621,"Wah","","","",""  ],
      [98622,"Clark","PacificPUD","","",""  ],
      [98624,"PacificPUD","","","",""  ],
      [98625,"Cowlitz","","","",""  ],
      [98626,"Cowlitz","","","",""  ],
      [98628,"Klick","","","",""  ],
      [98629,"Clark","","","",""  ],
      [98631,"PacificPUD","","","",""  ],
      [98632,"Cowlitz","Wah","","",""  ],
      [98635,"Klick","","","",""  ],
      [98638,"Wah","PacificPUD","","",""  ],
      [98639,"Skam","","","",""  ],
      [98640,"PacificPUD","","","",""  ],
      [98641,"PacificPUD","","","",""  ],
      [98642,"Clark","Cowlitz","","",""  ],
      [98643,"Wah","","","",""  ],
      [98644,"PacificPUD","","","",""  ],
      [98645,"Cowlitz","","","",""  ],
      [98647,"Wah","","","",""  ],
      [98648,"Skam","Cowlitz","Lewis","Klick","Clark"  ],
      [98649,"Cowlitz","Lewis","Skam","",""  ],
      [98650,"Klick","Yakama","","",""  ],
      [98651,"Skam","Klick","","",""  ],
      [98660,"Clark","","","",""  ],
      [98661,"Clark","","","",""  ],
      [98662,"Clark","","","",""  ],
      [98663,"Clark","","","",""  ],
      [98664,"Clark","","","",""  ],
      [98665,"Clark","","","",""  ],
      [98666,"Clark","","","",""  ],
      [98668,"Clark","","","",""  ],
      [98670,"Klick","","","",""  ],
      [98671,"Clark","Skam","","",""  ],
      [98672,"Klick","Skam","","",""  ],
      [98673,"Klick","","","",""  ],
      [98674,"Cowlitz","Clark","","",""  ],
      [98675,"Clark","Skam","","",""  ],
      [98682,"Clark","","","",""  ],
      [98683,"Clark","","","",""  ],
      [98684,"Clark","","","",""  ],
      [98685,"Clark","","","",""  ],
      [98686,"Clark","","","",""  ],
      [98687,"Clark","","","",""  ],
      [98801,"Chelan","Kitti","","",""  ],
      [98802,"Douglas","Chelan","","",""  ],
      [98807,"Chelan","","","",""  ],
      [98811,"Chelan","","","",""  ],
      [98812,"OkanoganPUD","Douglas","OCEC","",""  ],
      [98813,"Douglas","OkanoganPUD","Chelan","",""  ],
      [98814,"OkanoganPUD","OCEC","Chelan","",""  ],
      [98815,"Chelan","","","",""  ],
      [98816,"Chelan","OkanoganPUD","Douglas","",""  ],
      [98817,"Chelan","","","",""  ],
      [98819,"OkanoganPUD","","","",""  ],
      [98821,"Chelan","","","",""  ],
      [98822,"Chelan","Douglas","","",""  ],
      [98823,"Grant","","","",""  ],
      [98824,"Grant","","","",""  ],
      [98826,"Chelan","Sno","","",""  ],
      [98827,"OkanoganPUD","","","",""  ],
      [98828,"Chelan","Chelan","Kitti","",""  ],
      [98829,"OkanoganPUD","OCEC","","",""  ],
      [98830,"Douglas","Grant","OkanoganPUD","Nespelum","CouleeDam"  ],
      [98831,"Chelan","OkanoganPUD","","",""  ],
      [98832,"Grant","Avista","Inland","BigBend",""  ],
      [98833,"OkanoganPUD","OCEC","","",""  ],
      [98834,"OkanoganPUD","Douglas","Chelan","",""  ],
      [98836,"Chelan","","","",""  ],
      [98837,"Grant","","","",""  ],
      [98840,"OkanoganPUD","Nespelum","","",""  ],
      [98841,"OkanoganPUD","Nespelum","","",""  ],
      [98843,"Douglas","Chelan","","",""  ],
      [98844,"OkanoganPUD","Chelan","","",""  ],
      [98845,"Douglas","Grant","","",""  ],
      [98846,"OkanoganPUD","","","",""  ],
      [98847,"Chelan","Kitti","","",""  ],
      [98848,"Grant","Douglas","Kitti","",""  ],
      [98849,"OkanoganPUD","OCEC","","",""  ],
      [98850,"Douglas","Grant","Chelan","Kitti",""  ],
      [98851,"Grant","Douglas","","",""  ],
      [98852,"Chelan","Sno","OkanoganPUD","OCEC",""  ],
      [98853,"Grant","","","",""  ],
      [98855,"OkanoganPUD","Nespelum","","",""  ],
      [98856,"OkanoganPUD","OCEC","Chelan","",""  ],
      [98857,"Grant","Avista","BigBend","",""  ],
      [98858,"Douglas","Grant","","",""  ],
      [98859,"OkanoganPUD","","","",""  ],
      [98860,"Grant","","","",""  ],
      [98862,"OkanoganPUD","OCEC","","",""  ],
      [98901,"PacifiCorp","Kitti","","",""  ],
      [98902,"PacifiCorp","","","",""  ],
      [98903,"BREA","PacifiCorp","","",""  ],
      [98908,"PacifiCorp","","","",""  ],
      [98921,"BREA","PacifiCorp","","",""  ],
      [98922,"PSE","Kitti","Chelan","",""  ],
      [98923,"BREA","PacifiCorp","","",""  ],
      [98925,"PSE","","","",""  ],
      [98926,"Chelan","PSE","Kitti","Ellensburg",""  ],
      [98929,"PacifiCorp","","","",""  ],
      [98930,"BREA","PacifiCorp","","",""  ],
      [98932,"BREA","PacifiCorp","","",""  ],
      [98933,"BREA","PacifiCorp","Yakama","",""  ],
      [98934,"PSE","Kitti","","",""  ],
      [98935,"BREA","PacifiCorp","Klick","Yakama",""  ],
      [98936,"BREA","PacifiCorp","Grant","Benton",""  ],
      [98937,"PacifiCorp","Kitti","Lewis","",""  ],
      [98938,"BREA","PacifiCorp","","",""  ],
      [98939,"BREA","PacifiCorp","","",""  ],
      [98940,"PSE","","","",""  ],
      [98941,"PSE","Kitti","","",""  ],
      [98942,"PacifiCorp","","","",""  ],
      [98943,"PSE","Kitti","","",""  ],
      [98944,"Benton","BREA","PacifiCorp","",""  ],
      [98946,"PSE","Kitti","","",""  ],
      [98947,"PacifiCorp","","","",""  ],
      [98948,"BREA","PacifiCorp","Yakama","",""  ],
      [98950,"Klick","","","",""  ],
      [98951,"BREA","PacifiCorp","Yakama","",""  ],
      [98952,"BREA","PacifiCorp","Yakama","",""  ],
      [98953,"BREA","PacifiCorp","","",""  ],
      [99001,"Avista","Inland","","",""  ],
      [99003,"Avista","Inland","","",""  ],
      [99004,"Avista","Inland","Cheney","",""  ],
      [99005,"Avista","Inland","","",""  ],
      [99006,"Avista","Inland","PendO","",""  ],
      [99008,"Avista","Inland","","",""  ],
      [99009,"Inland","PendO","","",""  ],
      [99011,"Avista","","","",""  ],
      [99012,"Avista","Inland","","",""  ],
      [99013,"Avista","Inland","Ferry","",""  ],
      [99014,"Avista","Inland","","",""  ],
      [99016,"Avista","Inland","Vera","",""  ],
      [99017,"Avista","Inland","BigBend","",""  ],
      [99018,"Avista","Inland","","",""  ],
      [99019,"Avista","Inland","","",""  ],
      [99020,"Avista","Inland","","",""  ],
      [99021,"Avista","Inland","","",""  ],
      [99022,"Avista","Inland","","",""  ],
      [99023,"Avista","Inland","","",""  ],
      [99025,"Avista","Inland","","",""  ],
      [99026,"Avista","Inland","","",""  ],
      [99027,"Avista","Inland","","",""  ],
      [99029,"Avista","Inland","Ferry","",""  ],
      [99030,"Avista","Inland","","",""  ],
      [99031,"Avista","Inland","","",""  ],
      [99032,"Avista","Inland","BigBend","",""  ],
      [99033,"Avista","Inland","Clearwater","",""  ],
      [99034,"Avista","","","",""  ],
      [99036,"Avista","Inland","","",""  ],
      [99037,"Avista","Inland","Vera","",""  ],
      [99039,"Avista","Inland","","",""  ],
      [99040,"Avista","Ferry","","",""  ],
      [99101,"Avista","Ferry","","",""  ],
      [99102,"Avista","Inland","","",""  ],
      [99103,"Grant","Avista","Inland","",""  ],
      [99104,"Avista","Inland","Clearwater","",""  ],
      [99105,"Avista","BigBend","Inland","",""  ],
      [99107,"Avista","Ferry","PendO","",""  ],
      [99109,"Avista","Chewelah","Ferry","PendO",""  ],
      [99110,"Avista","Inland","","",""  ],
      [99111,"Avista","Inland","Clearwater","",""  ],
      [99113,"Avista","Inland","Clearwater","",""  ],
      [99114,"Avista","PendO","","",""  ],
      [99115,"Grant","Douglas","","",""  ],
      [99116,"CouleeDam","Douglas","Nespelum","OkanoganPUD",""  ],
      [99117,"Avista","Inland","Ferry","",""  ],
      [99118,"Ferry","OkanoganPUD","","",""  ],
      [99119,"PendO","","","",""  ],
      [99121,"Ferry","","","",""  ],
      [99122,"Avista","Inland","Ferry","",""  ],
      [99123,"Grant","Douglas","","",""  ],
      [99124,"Nespelum","","","",""  ],
      [99125,"Avista","Inland","BigBend","CREA",""  ],
      [99126,"Avista","","","",""  ],
      [99128,"Avista","Inland","Clearwater","",""  ],
      [99129,"Avista","Ferry","","",""  ],
      [99130,"Avista","Inland","Clearwater","",""  ],
      [99131,"Avista","Ferry","","",""  ],
      [99133,"Grant","Douglas","Nespelum","CouleeDam",""  ],
      [99134,"Avista","Inland","BigBend","CREA",""  ],
      [99135,"Grant","Douglas","","",""  ],
      [99136,"Avista","Inland","","",""  ],
      [99137,"Avista","Ferry","","",""  ],
      [99138,"Ferry","Avista","Nespelum","",""  ],
      [99139,"PendO","","","",""  ],
      [99140,"Ferry","Inland","Nespelum","",""  ],
      [99141,"Avista","PendO","","",""  ],
      [99143,"Avista","Inland","BigBend","CREA",""  ],
      [99144,"Avista","Inland","","",""  ],
      [99146,"Ferry","Avista","","",""  ],
      [99147,"Avista","Inland","","",""  ],
      [99148,"Avista","PendO","","",""  ],
      [99149,"Avista","Inland","Clearwater","",""  ],
      [99150,"Ferry","","","",""  ],
      [99151,"Avista","","","",""  ],
      [99152,"PendO","","","",""  ],
      [99153,"PendO","","","",""  ],
      [99154,"Avista","Inland","","",""  ],
      [99155,"OkanoganPUD","Nespelum","","",""  ],
      [99156,"PendO","Inland","Northern","",""  ],
      [99157,"Avista","PendO","","",""  ],
      [99158,"Avista","Inland","Clearwater","",""  ],
      [99159,"Avista","Inland","BigBend","Grant",""  ],
      [99160,"Avista","Ferry","","",""  ],
      [99161,"Avista","Inland","Clearwater","",""  ],
      [99163,"Avista","Inland","Clearwater","",""  ],
      [99164,"Avista","Inland","Clearwater","",""  ],
      [99166,"Ferry","Nespelum","OkanoganPUD","",""  ],
      [99167,"Avista","","","",""  ],
      [99169,"Avista","BigBend","Inland","Grant",""  ],
      [99170,"Avista","Inland","","",""  ],
      [99171,"Avista","Inland","","",""  ],
      [99173,"Avista","Ferry","","",""  ],
      [99174,"Avista","Inland","","",""  ],
      [99176,"Avista","Inland","Clearwater","",""  ],
      [99179,"Avista","Inland","Clearwater","",""  ],
      [99180,"PendO","","","",""  ],
      [99181,"Avista","Ferry","PendO","",""  ],
      [99185,"Avista","Inland","","",""  ],
      [99201,"Avista","","","",""  ],
      [99202,"Avista","Vera","","",""  ],
      [99203,"Avista","","","",""  ],
      [99204,"Avista","","","",""  ],
      [99205,"Avista","","","",""  ],
      [99206,"Avista","Inland","MEWCO","Vera",""  ],
      [99207,"Avista","","","",""  ],
      [99208,"Avista","Inland","","",""  ],
      [99212,"Avista","MEWCO","Vera","Inland",""  ],
      [99216,"Avista","MEWCO","Vera","",""  ],
      [99217,"Avista","Inland","","",""  ],
      [99218,"Avista","Inland","","",""  ],
      [99219,"Avista","Inland","","",""  ],
      [99223,"Avista","Inland","Vera","",""  ],
      [99224,"Avista","Inland","","",""  ],
      [99301,"BigBend","Franklin","","",""  ],
      [99320,"Benton","BREA","","",""  ],
      [99321,"Grant","","","",""  ],
      [99322,"Klick","","","",""  ],
      [99323,"CREA","PacifiCorp","","",""  ],
      [99324,"CREA","PacifiCorp","","",""  ],
      [99326,"BigBend","Franklin","Avista","",""  ],
      [99328,"CREA","PacifiCorp","","",""  ],
      [99329,"CREA","PacifiCorp","","",""  ],
      [99330,"BigBend","Franklin","","",""  ],
      [99333,"Avista","Inland","","",""  ],
      [99335,"BigBend","Franklin","","",""  ],
      [99336,"Benton","BREA","","",""  ],
      [99337,"Benton","BREA","","",""  ],
      [99338,"Benton","BREA","","",""  ],
      [99341,"Avista","BigBend","Grant","",""  ],
      [99343,"BigBend","Franklin","","",""  ],
      [99344,"Avista","BigBend","Grant","CREA","Franklin"  ],
      [99345,"Benton","BREA","","",""  ],
      [99346,"Benton","BREA","","",""  ],
      [99347,"CREA","Inland","PacifiCorp","Avista",""  ],
      [99348,"CREA","PacifiCorp","","",""  ],
      [99349,"Grant","Franklin","Kitti","",""  ],
      [99350,"Benton","BREA","Klick","",""  ],
      [99352,"Benton","BREA","Richland","",""  ],
      [99353,"Benton","BREA","Richland","",""  ],
      [99354,"Benton","BREA","Richland","",""  ],
      [99356,"Klick","","","",""  ],
      [99357,"Grant","","","",""  ],
      [99359,"Avista","CREA","BigBend","Inland",""  ],
      [99360,"CREA","PacifiCorp","","",""  ],
      [99361,"CREA","PacifiCorp","","",""  ],
      [99362,"CREA","PacifiCorp","","",""  ],
      [99363,"CREA","PacifiCorp","","",""  ],
      [99371,"Avista","BigBend","CREA","Inland",""  ],
      [99401,"Clearwater","Avista","","",""  ],
      [99402,"Clearwater","Avista","Inland","Asotin",""  ],
      [99403,"Avista","Clearwater","Inland","Asotin",""  ],
    ];


  for (var i = 0; i < utilityArray.length; i++) {
    if (utilityArray[i][0] == zipcode) {
      return (new Array(utilityArray[i][1], utilityArray[i][2], utilityArray[i][3], utilityArray[i][4], utilityArray[i][5]));
    }
  }

  return 0;
}

function getUtilityStats(utility) {
  var utilityArray = 
  [
    ["PSE","Puget Sound Energy",1  ],
    ["Avista","Avista Corp",0.83  ],
    ["PacifiCorp","Pacific Power and Light",1.13  ],
    ["SCL","Seattle City Light",0.02  ],
    ["Sno","PUD No 1 of Snohomish County",0.08  ],
    ["Cowlitz","PUD No 1 of Cowlitz County",0.07  ],
    ["Tacoma","Tacoma Power",0.07  ],
    ["Clark","PUD No 1 of Clark County",0.21  ],
    ["Grant","PUD No 2 of Grant County",0.37  ],
    ["Benton","PUD No 1 of Benton County",0.17  ],
    ["Chelan","PUD No 1 of Chelan County",0.18  ],
    ["Grays","PUD No 1 of Grays Harbor County",0.05  ],
    ["Franklin","PUD No 1 of Franklin County",0.14  ],
    ["PendO","PUD No 1 of Pend Oreille County",0.01  ],
    ["Lewis","PUD No 1 of Lewis County",0.1  ],
    ["Inland","Inland Power & Light Co",0.06  ],
    ["Richland","City of Richland",0.07  ],
    ["PortAng","City of Port Angeles",0.05  ],
    ["Douglas","PUD No 1 of Douglas County",0  ],
    ["Mason3","PUD No 3 of Mason County",0.05  ],
    ["Clallam","PUD No 1 of Clallam County",0.05  ],
    ["OkanoganPUD","PUD No 1 of Okanogan County",0.09  ],
    ["Peninsula","Peninsula Light Co",0.06  ],
    ["BREA","Benton Rural Electric Assoc",0.07  ],
    ["BigBend","Big Bend Electric Coop",0.06  ],
    ["Klick","PUD No 1 of Klickitat County",0.11  ],
    ["CREA","Columbia Rural Electric Assoc",0.12  ],
    ["PacificPUD","PUD No 2 of Pacific County",0.08  ],
    ["Centralia","City of Centralia",0.05  ],
    ["Elmhurst","Elmhurst Mutual Power & Light Co",0.05  ],
    ["Lakeview","Lakeview Light & Power",0.05  ],
    ["Vera","Vera Water & Power",0.09  ],
    ["MEWCO","Modern Electric Water Co",0.05  ],
    ["Opalco","Orcas Power & Light Coop",0.05  ],
    ["Ellensburg","City of Ellensburg",0.05  ],
    ["Whatcom","PUD No 1 of Whatcom County",0.05  ],
    ["Cheney","City of Cheney",0.07  ],
    ["Skam","PUD No 1 of Skamania County",0.05  ],
    ["Parkland","Parkland Light & Water Co",0.05  ],
    ["Ferry","PUD No 1 of Ferry County",0.05  ],
    ["Kitti","PUD No 1 of Kittitas County",0.05  ],
    ["Tanner","Tanner Electric Coop",0.05  ],
    ["Jefferson","Jefferson County PUD",0.05  ],
    ["Ohop","Ohop Mutual Light Co",0.05  ],
    ["Blaine","City of Blaine",0.05  ],
    ["Mason1","PUD No 1 of Mason County",0.05  ],
    ["Milton","City of Milton",0.05  ],
    ["OCEC","Okanogan County Electric Coop",0.05  ],
    ["Nespelum","Nespelem Valley Electric Coop",0.05  ],
    ["Wah","PUD No 1 of Wahkiakum County",0.05  ],
    ["Steilacoom","Town of Steilacoom",0.05  ],
    ["McCleary","McCleary Light & Power",0.05  ],
    ["Sumas","City of Sumas",0.05  ],
    ["Eaton","Town of Eatonville",0.05  ],
    ["Chewelah","Chewelah Light Dept",0.05  ],
    ["CouleeDam","Coulee Dam Light Dept",0.05  ],
    ["Clearwater","Clearwater Power Co",0.05  ],
    ["Ruston","Ruston Electric Utility",0.07  ],
    ["Alder","Alder Mutual Light Co",0.05  ],
    ["Northern","Northern Lights, Inc",0.05  ],
    ["Asotin","PUD No 1 of Asotin County",0.05  ]
  ];

  if (utility != null) {
    for (var i = 0; i < utilityArray.length; i++) {
      if (utilityArray[i][0] == utility) {
        return (new Array(utilityArray[i][1], utilityArray[i][2]));
      }
    }
  }

  return null;

}