// ==UserScript==
// @name YouTube AD Blocker
// @name:zh-CN Anzeigen auf YouTube entfernen
// @name:zh-TW Werbung von YouTube entfernen
// @name:zh-HK Werbung auf YouTube entfernen
// @name:zh-MO YouTube entfernt Werbung
// @namespace https://github.com/iamfugui/YouTubeADB
// @version 6.01
// @description Dies ist ein Skript zum Entfernen von YouTube-Anzeigen. Es ist leicht und effizient. Es kann Schnittstellenanzeigen und Videoanzeigen, einschließlich 6S-Anzeigen, problemlos entfernen. Dies ist ein Skript zum Entfernen von Anzeigen auf YouTube. Es ist leichtgewichtig und effizient und kann Schnittstellen- und Videoanzeigen, einschließlich 6s-Anzeigen, problemlos entfernen.
// @description:zh-CN Dies ist ein Skript zum Entfernen von YouTube-Anzeigen. Es ist leichtgewichtig und effizient. Es kann Schnittstellenanzeigen und Videoanzeigen, einschließlich 6S-Anzeigen, problemlos entfernen.
// @description:zh-TW Dies ist ein Skript zum Entfernen von YouTube-Anzeigen. Es ist leichtgewichtig und effizient. Es kann Schnittstellenanzeigen und Videoanzeigen, einschließlich 6S-Anzeigen, problemlos entfernen.
// @description:zh-HK Dies ist ein Skript zum Entfernen von YouTube-Anzeigen. Es ist leichtgewichtig und effizient. Es kann Schnittstellenanzeigen und Videoanzeigen, einschließlich 6S-Anzeigen, reibungslos entfernen.
// @description:zh-MO Dies ist ein Skript zum Entfernen von YouTube-Anzeigen. Es ist leichtgewichtig und effizient. Es kann Schnittstellenanzeigen und Videoanzeigen, einschließlich 6S-Anzeigen, reibungslos entfernen.
// @author iamfugui
// @match        https://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @license MIT
// @downloadURL
// @updateURL
// ==/UserScript==
(function() {
    `use strict`;

    //Interface-Anzeigenselektor
    const cssSeletorArr = [
         `#masthead-ad`,//Die Bannerwerbung oben auf der Homepage.
         `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`,//Video-Layout-Werbung für die Startseite.
         `.video-ads.ytp-ad-module`,//Anzeigen am unteren Rand des Players.
         `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`, //Werbung zur Mitgliedschaftsförderung auf der Seite abspielen.
         `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`,//Empfohlene Anzeigen in der oberen rechten Ecke der Wiedergabeseite.
         `#related #player-ads`,//Bewerben Sie Anzeigen auf der rechten Seite des Kommentarbereichs auf der Play-Seite.
         `#related ytd-ad-slot-renderer`, //Video-Layout-Werbung auf der rechten Seite des Kommentarbereichs der Wiedergabeseite.
         `ytd-ad-slot-renderer`, // Seitenanzeige durchsuchen.
         `yt-mealbar-promo-renderer`, //Werbung für Empfehlungen von Seitenmitgliedern abspielen.
         `ad-slot-renderer`,//M spielt von Drittanbietern empfohlene Anzeigen auf der Seite ab
         `ytm-companion-ad-renderer`,//M überspringbarer Videoanzeigenlink
    ];

    window.dev=true;/// show log messages

    /**
     * Formatieren Sie die Standardzeit
     * @param {Datum} Zeit Standardzeit
     * @param {String} Formatformat
     * @return {String}
     */
    function moment(time) {
        // Jahr, Monat, Stunde, Minute und Sekunde abrufen
        let y = time.getFullYear()
        let m = (time.getMonth() + 1).toString().padStart(2, `0`)
        let d = time.getDate().toString().padStart(2, `0`)
        let h = time.getHours().toString().padStart(2, `0`)
        let min = time.getMinutes().toString().padStart(2, `0`)
        let s = time.getSeconds().toString().padStart(2, `0`)
        return `${y}-${m}-${d} ${h}:${min}:${s}`
    }

    /**
     * Ausgabeinformationen
     * @param {String} Nachrichteninformationen
     * @return {undefiniert}
     */
    function log(msg) {
        if(!window.dev){
            return false;
        }
        console.log(window.location.href);
        console.log(`${moment(new Date())}  ${msg}`);
    }

    /**
     * Setzen des Run-Flag
     * @param {String} Name
     * @return {undefiniert}
     */
    function setRunFlag(name){
        let style = document.createElement(`style`);
        style.id = name;
        (document.querySelector(`head`) || document.querySelector(`body`)).appendChild(style);//Knoten an HTML anhängen.
    }

    /**
     * Holt das Run-Flag
     * @param {String} Name
     * @return {undefiniert|Element}
     */
    function getRunFlag(name){
        return document.getElementById(name);
    }

    /**
     * Überprüfen Sie, ob das Run-Flag
     * @param {String} Name
     * @return {Boolean}
     */
    function checkRunFlag(name){
        if(getRunFlag(name)){
            return true;
        }else{
            setRunFlag(name)
            return false;
        }
    }

    /**
     * Generieren Sie einen CSS-Elementstil, der Werbung entfernt, und hängen Sie ihn an den HTML-Knoten an
     * @param {String} formatiert Stiltext
     * @return {undefiniert}
     */
    function generateRemoveADHTMLElement(id) {
        //Wenn es gesetzt wurde, beenden.
        if (checkRunFlag(id)) {
            log(`Knoten zum Blockieren von Seitenwerbung wurde generiert`);
            return false
        }

        // Legen Sie den Stil der Entfernungsanzeige fest.
        let style = document.createElement(`style`);//Stilelement erstellen.
        (document.querySelector(`head`) || document.querySelector(`body`)).appendChild(style);//Knoten an HTML anhängen.
        style.appendChild(document.createTextNode(generateRemoveADCssText(cssSeletorArr)));//Stilknoten an Elementknoten anhängen.
        log(`Anzeigenknoten zum Blockieren der Seite erfolgreich generiert`);
    }

    /**
     * Generieren Sie CSS-Text, um Anzeigen zu entfernen
     * @param {Array} cssSeletorArr Array der festzulegenden CSS-Selektoren
     * @return {String}
     */
    function generateRemoveADCssText(cssSeletorArr){
        cssSeletorArr.forEach((seletor,index)=>{
            cssSeletorArr[index]=`${seletor}{display:none!important}`;//Traversieren und Stile festlegen.
        });
        return cssSeletorArr.join(` `);// als String zurückgeben
    }

    /**
     * Touch-Ereignis
     * @return {undefiniert}
     */
    function nativeTouch(){
        // Touch-Objekt erstellen
        let touch = new Touch({
            identifier: Date.now(),
            target: this,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        // TouchEvent-Objekt erstellen
        let touchStartEvent = new TouchEvent(`touchstart`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        // Touchstart-Ereignis an Zielelement senden
        this.dispatchEvent(touchStartEvent);

        // TouchEvent-Objekt erstellen
        let touchEndEvent = new TouchEvent(`touchend`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        // Touchend-Ereignis an Zielelement senden
        this.dispatchEvent(touchEndEvent);
    }

    /**
     * Anzeigen überspringen
     * @return {undefiniert}
     */
    function skipAd(mutationsList, observer) {
        let video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);//Den Videoknoten abrufen
        let skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
        let shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`);

        if(skipButton){
            // Mobile Stummschaltung hat einen Fehler
            if( window.location.href.indexOf("https://m.youtube.com/") === -1){
                video.muted = true;
            }
            if(video.currentTime>0.5){
                video.currentTime = video.duration;// Telefon
                log(`Spezielle Konto-Button-Werbung überspringen~~~~~~~~~~~~~`);
                return;
            }
            skipButton.click();//PC
            nativeTouch.call(skipButton);// Phone
            log(`### skip ad ###`);
        }else if(shortAdMsg){
            video.currentTime = video.duration;
            log(`### force ad to stop ###`);
        }else{
            // log(`######Anzeige existiert nicht######`);
        }

    }

    /**
     * Entfernen Sie Werbung während der Wiedergabe
     * @return {undefiniert}
     */
    function removePlayerAD(id){
        // Wenn es bereits läuft, beenden Sie es.
        if (checkRunFlag(id)) {
            log(`Die Funktion zum Entfernen von Werbung während der Wiedergabe läuft bereits`);
            return false
        }
        let observer;// Zuhörer
        let timerID;// Timer

        // Start listening
        function startObserve(){
            // Werbeknotenüberwachung
            const targetNode = document.querySelector(`.video-ads.ytp-ad-module`);
            if(!targetNode){
                log(`Suche nach dem zu überwachenden Zielknoten`);
                return false;
            }
            // Hören Sie sich die Werbung im Video an und verarbeiten Sie sie
            const config = {childList: true, subtree: true };// Änderungen im Zielknoten selbst und in Knoten unter dem Teilbaum überwachen
            observer = new MutationObserver(skipAd);// Erstellen Sie eine Observer-Instanz und legen Sie die Rückruffunktion für die Verarbeitung von Ankündigungen fest
            observer.observe(targetNode, config);// Beobachten Sie Werbeknoten mit der obigen Konfiguration
            timerID=setInterval(skipAd, 500);// Diejenigen, die durchs Netz gerutscht sind
        }

        // Abfrageaufgabe
        let startObserveID = setInterval(()=>{
            if(observer && timerID){
                clearInterval(startObserveID);
            }else{
                startObserve();
            }
        },16);

        log(`Die Funktion zum Entfernen von Werbung während der Wiedergabe wurde erfolgreich ausgeführt`);
    }

    /**
    * Hauptfunktion
    */
    function main(){
        generateRemoveADHTMLElement(`removeADHTMLElement`);// Werbung in der Schnittstelle entfernen.
        removePlayerAD(`removePlayerAD`);// Entferne die abgespielte Werbung.
    }

    log('Youtube Ad blocker loading ....');
    if (document.readyState === `loading`) {
        log(`waiting to start Youtube Ad blocker ...`);
        document.addEventListener(`DOMContentLoaded`, main);// Der Ladevorgang ist zu diesem Zeitpunkt noch nicht abgeschlossen
    } else {
        log(`Youtube Ad blocker started`);
        main();// Zu diesem Zeitpunkt wurde „DOMContentLoaded“ ausgelöst
    }

})();
