'use strict';

/**
 * @version 0.0.1
 *
 * Koha RFP Form
 *
 * Repository
 * @see {@link https://github.com/Hypernova-Oy/Koha-Hosting-Web-Form}
 *
 * @license GPL3+
 * @copyright Hypernova Oy
 */
class KohaRFPForm {
  /**
   * 
   * @param {HTMLElement} htmlRoot
   * @param {Object} options
   *                   locale: fi  if not passed, tries to guess it
   */
  constructor(htmlRoot, options) {
    this.checkRequirements();

    this.htmlRoot = htmlRoot;

    if (options.locale && ! /^\w\w[-_]\w\w$|^\w\w$/.exec(options.locale)) {
      console.log(`Given locale '${options.locale}' is not a valid locale, like en, or fi-FI. Defaulting to fi.`);
      options.locale = 'fi';
    }
    this.locale = options.locale;
    if (!this.locale) {
      this.locale = window.navigator.userLanguage || window.navigator.language;
      console.log("locale '"+this.locale+"'inferred from user browser");
    }

    // Render the HTML
    // Warning, there is no sanitation done here. Make sure you have clean data! Currently only this.id is interpolated.
    this.htmlRoot.innerHTML = `
  <table>
    <tbody>
      <tr>
        <td><h3>Perustiedot</h3></td>
      </tr>
      <tr>
        <td><label for="kohaBasicAnnualCirc">Vuosilainaus</label></td><td><input type="number" id="kohaBasicAnnualCirc"/></td>
      </tr>
      <tr>
        <td><label for="kohaBasicBibRecords">Luettelointitietueita</label></td><td><input type="number" id="kohaBasicBibRecords"/></td>
      </tr>
      <tr>
        <td><label for="kohaBasicActiveStaff">Kohaa käyttävän henkilökunnan määrä</label></td><td><input type="number" id="kohaBasicActiveStaff"/></td>
      </tr>
      <tr>
        <td><h3>Integraatiot</h3></td>
      </tr>
      <tr>
        <td><label for="kohaIntgFinna">Finna-integraatio</label></td><td><input type="checkbox" id="kohaIntgFinna"/></td>
      </tr>
      <tr>
        <td><label for="kohaIntgMelinda">Melinda-integraatio</label></td><td><input type="checkbox" id="kohaIntgMelinda"/></td>
      </tr>
      <tr>
        <td><label for="kohaIntgSip2Clients">SIP2-laitteita</label></td><td><input type="number" id="kohaIntgSip2Clients" size="1"/></td>
      </tr>
      <tr>
        <td><label for="kohaIntgSmtp">Sähköpostin lähetys</label></td><td><input type="checkbox" checked disabled="true" id="kohaIntgSmtp"/></td>
      </tr>
      <tr>
        <td><label for="kohaIntgSms">Tekstiviesti-ilmoitukset</label></td><td><input type="checkbox" id="kohaIntgSms"/></td>
      </tr>
      <tr>
        <td><label for="kohaIntgOther">Muut integraatiot</label></td><td><textarea id="kohaIntgOther"></textarea></td>
      </tr>
      <tr style="display: none;">
        <td><h3>Vuosikustannus:</h3> <span id="kohaTotalCostView">1500</span> €<input type="hidden" id="kohaTotalCost"/></td>
      </tr>
    </tbody>
  </table>
    `;
    // Bind onChange event listeners to all input elements
    $(this.htmlRoot).find('input').change(() => {
      this.recalculatePrice();
    });
  }

  checkRequirements() {
    if(typeof jQuery === 'undefined') {
      throw new Error("jQuery https://jquery.com/ is not available");
    }
  }

  recalculatePrice() {
    let kohaBasicAnnualCirc =  document.getElementById('kohaBasicAnnualCirc').value;
    let kohaBasicBibRecords =  document.getElementById('kohaBasicBibRecords').value;
    let kohaBasicActiveStaff = document.getElementById('kohaBasicActiveStaff').value;
    let kohaIntgFinna =        document.getElementById('kohaIntgFinna').value;
    let kohaIntgMelinda =      document.getElementById('kohaIntgMelinda').value;
    let kohaIntgSip2Clients =  document.getElementById('kohaIntgSip2Clients').value;
    let kohaIntgSmtp =         document.getElementById('kohaIntgSmtp').value;
    let kohaIntgSms =          document.getElementById('kohaIntgSms').value;

    let minimumCost = 1000;



    let totalCost = 1000;

    document.getElementById('kohaTotalCostView').innerHTML = totalCost;
    document.getElementById('kohaTotalCost').value = totalCost;
  }

  exportCsv() {
    let map = {};
    $(this.htmlRoot).find('input').each(function(index) {
      map[this.id] = this.value;
    });
    let keys = Object.keys(map).sort();

    let values = '';
    keys.forEach((key, i) => {
      let val = map[key].replace("'", "\\'");
      if (i == 0) values = "'"+val+"'";
      else values += ",'"+val+"'";
    });

    let header = keys.join(',');
    return header + "\n" + values + "\n";
  }

  /**
   * Using globalize.js would be more reasonable, but not doing anything more complicated than absolutely necessary due to Koha not having any modern user interface infrastructure to support dynamic anything.
   * 
   * _() might look like a bad naming convention at first, but this is how GNU gettext is used on the serverside.
   * @param {String} msg to translate
   */
  _(msg) {
    if (KohaRFPForm.translations[this.locale][msg]) return KohaRFPForm.translations[this.locale][msg];
    return `UNTRANSLATEABLE"${this.locale}:${msg}"`;
  }
}

KohaRFPForm.translations = {

};
