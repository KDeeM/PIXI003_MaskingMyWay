const app = new PIXI.Application({
  width: 320,
  height: 320,
});

// add app view to dom
const element = document.querySelector("#pixiApp");
element.appendChild(app.view);

app.loader.add("background", "background.jpg").load(startApp);

function startApp(loader, resources) {
  // create the background from the resource
  let background = new PIXI.Sprite(resources.background.texture);
  app.stage.addChild(background);

  // Add Text above background
  let text = new PIXI.Text(
    "Backgrounds Rock",
    {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    }
  )
  text.anchor.set( 0.5 );
  text.position.x = app.screen.width / 2;
  text.position.y = app.screen.height / 2;
  app.stage.addChild( text );

  let mask = createMask();
  mask.state = 1;

  // add the mask to the pixi app and set is as the mask for our background
  app.stage.addChild(mask);
  app.stage.mask = mask;
  
  app.stage.interactive = true;
  app.stage.on('mousemove', pointerMove);

  function pointerMove(event) {
    mask.position.x = event.data.global.x - mask.width / 2;
    mask.position.y = event.data.global.y - mask.height / 2;
  }

  // change the scale of the mask when user clicks
  app.stage.on("click", adjustMask);
  function adjustMask( event ){
    console.log("click");
    switch(mask.state){
      case 1:
        mask.state = 2;
        setScale( mask, 2 );
        break;
      case 2:
        mask.alpha = 0;
        mask.state = 0;
        setScale( mask, 0.1 );
        break;
      default:
        mask.alpha = 1;
        mask.state = 1;
        setScale( mask, 1 );
    }
    mask.position.x = event.data.global.x - mask.width / 2;
    mask.position.y = event.data.global.y - mask.height / 2;
    return;
  }

  app.stage

  return;
}

function createMask() {
  let r = 40;
  let blur_size = 10;

  // create circle for blur

  let circle = new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(r+blur_size, r+blur_size, r)
    .endFill();
  circle.filters = [new PIXI.filters.BlurFilter(blur_size)];

  // create bounds that define the bounds of the circle
  let cBounds = new PIXI.Rectangle(
    0,
    0,
    (r + blur_size) * 2,
    (r + blur_size) * 2
  );

  // we create a texture from the blurred circle and create a mask Sprite from it
  let circleTexture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, cBounds);
  let circleMask = new PIXI.Sprite(circleTexture);

  return circleMask;
}

let MQL = window.matchMedia( "(min-width: 480px)" );
MQL.addEventListener( "change", handleMediaResize)

function handleMediaResize( ev ){
  msg = "Screen is larger than 480px";
  if( !ev.currentTarget.matches ){
    msg = "Screen is smaller than 480px";
  }

  console.log(msg);
  return;
}

function setScale( mask, scale ){
  try{
    mask.scale.set( scale );
  }
  catch(err){
    return false;
  }

  return true;
}