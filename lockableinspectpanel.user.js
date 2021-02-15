// ==UserScript==
// @name         Lockable Inspect Panel
// @namespace    bl4ckscor3
// @version      1.0
// @description  EyeWire script to lock the scouts+ inspect panel in a specific place 
// @author       bl4ckscor3
// @match        https://eyewire.org/
// @grant        none
// @updateURL    https://raw.githubusercontent.com/bl4ckscor3/LockableInspectPanel/master/lockableinspectpanel.user.js
// @downloadURL  https://raw.githubusercontent.com/bl4ckscor3/LockableInspectPanel/master/lockableinspectpanel.user.js
// @homepageURL  https://github.com/bl4ckscor3/LockableInspectPanel
// ==/UserScript==

/* globals $ account */

(function() {
    'use strict';

    const checkAccount = setInterval(function() {
        if(typeof account === "undefined" || !account.account.uid) {
            return;
        }

        clearInterval(checkAccount);

        if(account.can("scout", "scythe", "mystic", "admin")) {
            main();
        }
    }, 100);

    function main() {
        const imgLocked = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHmSURBVDhPxZRNSxtRFIbnzmiFqoQuurFoUZGA2EZNDdRYwZV05caNK91Il64KYv+AtOAHguBKFNx10x8gbUksqIn+AFdaI4iShbgxNnP7nMm0ZnIzEoTSF17OR27eOefcD+u/oCc2oF7EEsoP70Xoor74oGU7Tlwp9Y6wH2qY1VqvuW7x8DDzQ5YZqCrYP5BUtu1M4y7ARi95h2s4g+j6wf6OfCQA27cBKGUPY1agiG1T3CSVTeF/g01wlTWvsQZCBNUHzCP42XXdt5nd1GZ2L7WhtTtK7gtsYM0c1oAh2NnVLSYJaUcvHuynbyUhyO6lC1S6hCutyhoDhmAk8qQO8xj+ota8lwziArqw2YsqYAiys773MAR2OZ5406aUNU96gpAq9FetvV0tRzPzG/H9LUYwy3xzfmwFyml59nySxe/9kI+pDuIolI16CpOwvfSbx5fER2e544z8QVDZcrV+v7PTvUL8nVIqgICGMcMqOKX1AvYG/m0tDLUIjnOIY7T2Cn+slApHLYIcH+snPIZyXO5FLYIpbkieGV7iV38RylApaFx20MpD8clxnI/4LaVUOCqPTYFZyaW/gnJLhHJzoj6lgD954aml9fJZ7uQc34PxfMUTQ/VsQi2jQMstcr9lxv8KlvUbGzyLBB+K5D4AAAAASUVORK5CYII=";
        const imgUnlocked = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHPSURBVDhPxVTLSkJBGJ45Y0E3xKiNUVERQlSWty6a0KJ1LdpUhK3qCYIeIWoVrXqAIKInCKKLFmiaD9DKUkEIF1GLLM/0jU7CuWgWRB98/Jcz55/5LzPkXzDs9NIRp49KsyaqLhp3TxOFMTeldAOmC+RggnN+oKrFZDJ+I5YZwKTUwOX1U8Ys6wh2BHMStEt64FtRFCWXzaSSsA1QpNSAUiUIsQ+2gGc4XAgnW4N+AbaCq6ApTFP2TARPIebAE1VVl+9uI+/C7/YFGrHZcTx6tSBsMxgCDgwOEVt7xyvUJpwsEI+GzYtVBYaUrVabBaIZ/MB++ZLzBzAERGel9jtoUnb7ZnooJdtwL8FUkfI55+Sl/LWCNnR6VuqHaNZWIhbOSFs7Nvau3hAWb0oTm9F+2A4QnaedoB/sK38rcRT2PUYoLn4Q0Kdslu8lOj0mCP267NJAE8N0DnVII/UC5BtYSa0a6gm4iNlzIjUP9PmyqzrqCYjxIY9gCkSjaqOegGHO1Txq+AT92yHXBxQvih7disJ2GWM70MUDURP6sSmgVlNQn0FxSwTFzXFIigN8+QXThPO9bOYhB70Ew13GA9CAJtRTCsRSi4lYRNT4r0DIJ0sGezBlDuO8AAAAAElFTkSuQmCC";
        const controls = $("#cubeInspectorFloatingControls");
        let locked = getLocalSetting("locked", false);
        let top = getLocalSetting("top", controls.css("top"));
        let left = getLocalSetting("left", controls.css("left"));
        
        controls.first().append(`<div id="inspectPanelLock" style="cursor: pointer; position: sticky; width: 20px; height: 20px; margin-left: 97%; background: url('${locked ? imgLocked : imgUnlocked}')">`);
        $("#inspectPanelLock").click(() => {
            locked = !locked;

            if(locked) {
                let newTop = controls.css("top");
                let newLeft = controls.css("left");

                top = newTop;
                left = newLeft;
                setLocalSetting("top", top);
                setLocalSetting("left", left);
            }

            setLocalSetting("locked", locked)
            controls.draggable({disabled: locked});
            $("#inspectPanelLock").css("background", `url('${locked ? imgLocked : imgUnlocked}')`);
        });
        //EyeWire sets the position itself, so wait for EW to set the position before setting it to the correct one
        setTimeout(() => {
            controls.css("top", top);
            controls.css("left", left);
        }, 1000);
        controls.draggable({disabled: locked});

        function setLocalSetting(setting, value) {
            localStorage.setItem(account.account.uid + "-lip-" + setting, value);
        }
    
        function getLocalSetting(setting, defaultValue) {
            let storedValue = localStorage.getItem(account.account.uid + "-lip-" + setting);
    
            if(storedValue === null) {
                setLocalSetting(setting, defaultValue);
                return defaultValue;
            }
            else {
                return typeof defaultValue === "boolean" ? storedValue === "true" : storedValue;
            }
        }
    }
})();