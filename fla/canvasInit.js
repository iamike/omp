var canvas, stage, exportRoot;

function init() {
    canvas = document.getElementById("canvas");
    images = images || {};
    ss = ss || {};

    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", handleComplete);
    loader.addEventListener("progress", handleProgress);
    loader.loadFile({src:"fla/images/canvasAnim_atlas_.json", type:"spritesheet", id:"canvasAnim_atlas_"}, true);

    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_"
    // }, true);

    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_2.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_2"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_3.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_3"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_4.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_4"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_5.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_5"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_6.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_6"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_7.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_7"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_8.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_8"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_9.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_9"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_10.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_10"
    // }, true);
    // loader.loadFile({
    //     src: "fla/images/canvasAnim_atlas_11.json",
    //     type: "spritesheet",
    //     id: "canvasAnim_atlas_11"
    // }, true);
    loader.loadManifest(lib.properties.manifest);
}

function handleFileLoad(evt) {
    if (evt.item.type == "image") {
        images[evt.item.id] = evt.result;
    }
}

function handleComplete(evt) {
    var queue = evt.target;
    ss["canvasAnim_atlas_"] = queue.getResult("canvasAnim_atlas_");
    // ss["canvasAnim_atlas_2"] = queue.getResult("canvasAnim_atlas_2");
    // ss["canvasAnim_atlas_3"] = queue.getResult("canvasAnim_atlas_3");
    // ss["canvasAnim_atlas_4"] = queue.getResult("canvasAnim_atlas_4");
    // ss["canvasAnim_atlas_5"] = queue.getResult("canvasAnim_atlas_5");
    // ss["canvasAnim_atlas_6"] = queue.getResult("canvasAnim_atlas_6");
    // ss["canvasAnim_atlas_7"] = queue.getResult("canvasAnim_atlas_7");
    // ss["canvasAnim_atlas_8"] = queue.getResult("canvasAnim_atlas_8");
    // ss["canvasAnim_atlas_9"] = queue.getResult("canvasAnim_atlas_9");
    // ss["canvasAnim_atlas_10"] = queue.getResult("canvasAnim_atlas_10");
    // ss["canvasAnim_atlas_11"] = queue.getResult("canvasAnim_atlas_11");
    exportRoot = new lib.canvasAnim();

    stage = new createjs.Stage(canvas);
    stage.addChild(exportRoot);
    stage.update();

    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stage);
}

function handleProgress(evt) {
    var loaded = Math.floor(evt.loaded * 100);
    $(".progress").text(loaded + "%");

}