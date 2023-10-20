// sketch.js

/* global describe p5 setup draw P2D WEBGL ARROW CROSS HAND MOVE TEXT WAIT HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS DEG_TO_RAD RAD_TO_DEG CORNER CORNERS RADIUS RIGHT LEFT CENTER TOP BOTTOM BASELINE POINTS LINES LINE_STRIP LINE_LOOP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS CLOSE OPEN CHORD PIE PROJECT SQUARE ROUND BEVEL MITER RGB HSB HSL AUTO ALT BACKSPACE CONTROL DELETE DOWN_ARROW ENTER ESCAPE LEFT_ARROW OPTION RETURN RIGHT_ARROW SHIFT TAB UP_ARROW BLEND REMOVE ADD DARKEST LIGHTEST DIFFERENCE SUBTRACT EXCLUSION MULTIPLY SCREEN REPLACE OVERLAY HARD_LIGHT SOFT_LIGHT DODGE BURN THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR NORMAL ITALIC BOLD BOLDITALIC LINEAR QUADRATIC BEZIER CURVE STROKE FILL TEXTURE IMMEDIATE IMAGE NEAREST REPEAT CLAMP MIRROR LANDSCAPE PORTRAIT GRID AXES frameCount deltaTime focused cursor frameRate getFrameRate setFrameRate noCursor displayWidth displayHeight windowWidth windowHeight width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams pushStyle popStyle popMatrix pushMatrix registerPromisePreload camera perspective ortho frustum createCamera setCamera setAttributes createCanvas resizeCanvas noCanvas createGraphics blendMode noLoop loop push pop redraw applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase createStringDict createNumberDict storeItem getItem clearStorage removeItem select selectAll removeElements createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ pRotateDirectionX pRotateDirectionY pRotateDirectionZ turnAxis setMoveThreshold setShakeThreshold isKeyPressed keyIsPressed key keyCode keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveGif saveFrames loadImage image tint noTint imageMode pixels blend copy filter get loadPixels set updatePixels loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo createWriter save saveJSON saveJSONObject saveJSONArray saveStrings saveTable writeFile downloadFile abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont append arrayCopy concat reverse shorten shuffle sort splice subset float int str boolean byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim day hour minute millis month second year plane box sphere cylinder cone ellipsoid torus orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadModel model loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess remove canvas drawingContext*/

// ==================
// these variables hold correct accelerometer/gyroscope values
// for both iOS 13 and Pixel 4

// gyroscope
let rotX = 0
let rotY = 0
let rotZ = 0

// acclerometer
let accX = 0
let accY = 0
let accZ = 0

let hasSensorPermission = !(DeviceOrientationEvent.requestPermission || DeviceMotionEvent.requestPermission)

// 3d transformation helpers
let ROTX = a => [1, 0, 0, 0, 0, cos(a), -sin(a), 0, 0, sin(a), cos(a), 0, 0, 0, 0, 1]
let ROTY = a => [cos(a), 0, sin(a), 0, 0, 1, 0, 0, -sin(a), 0, cos(a), 0, 0, 0, 0, 1]
let ROTZ = a => [cos(a), -sin(a), 0, 0, sin(a), cos(a), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
let MULT = (A, B) => [(A)[0] * (B)[0] + (A)[1] * (B)[4] + (A)[2] * (B)[8] + (A)[3] * (B)[12], (A)[0] * (B)[1] + (A)[1] * (B)[5] + (A)[2] * (B)[9] + (A)[3] * (B)[13], (A)[0] * (B)[2] + (A)[1] * (B)[6] + (A)[2] * (B)[10] + (A)[3] * (B)[14], (A)[0] * (B)[3] + (A)[1] * (B)[7] + (A)[2] * (B)[11] + (A)[3] * (B)[15], (A)[4] * (B)[0] + (A)[5] * (B)[4] + (A)[6] * (B)[8] + (A)[7] * (B)[12], (A)[4] * (B)[1] + (A)[5] * (B)[5] + (A)[6] * (B)[9] + (A)[7] * (B)[13], (A)[4] * (B)[2] + (A)[5] * (B)[6] + (A)[6] * (B)[10] + (A)[7] * (B)[14], (A)[4] * (B)[3] + (A)[5] * (B)[7] + (A)[6] * (B)[11] + (A)[7] * (B)[15], (A)[8] * (B)[0] + (A)[9] * (B)[4] + (A)[10] * (B)[8] + (A)[11] * (B)[12], (A)[8] * (B)[1] + (A)[9] * (B)[5] + (A)[10] * (B)[9] + (A)[11] * (B)[13], (A)[8] * (B)[2] + (A)[9] * (B)[6] + (A)[10] * (B)[10] + (A)[11] * (B)[14], (A)[8] * (B)[3] + (A)[9] * (B)[7] + (A)[10] * (B)[11] + (A)[11] * (B)[15], (A)[12] * (B)[0] + (A)[13] * (B)[4] + (A)[14] * (B)[8] + (A)[15] * (B)[12], (A)[12] * (B)[1] + (A)[13] * (B)[5] + (A)[14] * (B)[9] + (A)[15] * (B)[13], (A)[12] * (B)[2] + (A)[13] * (B)[6] + (A)[14] * (B)[10] + (A)[15] * (B)[14], (A)[12] * (B)[3] + (A)[13] * (B)[7] + (A)[14] * (B)[11] + (A)[15] * (B)[15]]
let TRFM = (A, v) => [((A)[0] * (v)[0] + (A)[1] * (v)[1] + (A)[2] * (v)[2] + (A)[3]) / ((A)[12] * (v)[0] + (A)[13] * (v)[1] + (A)[14] * (v)[2] + (A)[15]), ((A)[4] * (v)[0] + (A)[5] * (v)[1] + (A)[6] * (v)[2] + (A)[7]) / ((A)[12] * (v)[0] + (A)[13] * (v)[1] + (A)[14] * (v)[2] + (A)[15]), ((A)[8] * (v)[0] + (A)[9] * (v)[1] + (A)[10] * (v)[2] + (A)[11]) / ((A)[12] * (v)[0] + (A)[13] * (v)[1] + (A)[14] * (v)[2] + (A)[15])]
let PROJ = (f, v) => [(f) * (v)[0] / (v)[2], (f) * (v)[1] / (v)[2]]



// iOS 13 requires pages to beg for user permission before accessing sensors.
// it must also be triggered by a 'touchend'
function begPermission() {
  if (DeviceOrientationEvent.requestPermission) {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {

          if (DeviceMotionEvent.requestPermission) {
            DeviceMotionEvent.requestPermission()
              .then(response => {
                if (response == 'granted') {
                  hasSensorPermission = true
                  window.ondevicemotion = function (event) {

                    // devices such as iOS 13 doesn't have accleration,
                    // instead they have accelerationIncludingGravity, producing inconsistent behavior.
                    // here we patch it by canelling out the gravitational acclerration.
                    // alternatively, we add the gravitational acceleration to android phones.
                    if (!event.acceleration) {

                      // compute gravitational acceleration's component on X Y Z axes based on gyroscope
                      // g = ~ 9.80665
                      let grav = TRFM(MULT(
                        ROTY(radians(rotationY)),
                        ROTX(radians(rotationX))
                      ), [0, 0, -9.80665])

                      accX = (event.accelerationIncludingGravity.x + grav[0])
                      accY = (event.accelerationIncludingGravity.y + grav[1])
                      accZ = (event.accelerationIncludingGravity.z - grav[2])

                      // p5 appears to be doubling the acceleration:
                      // https://github.com/processing/p5.js/blob/main/src/events/acceleration.js#L647
                      accX *= 2
                      accY *= 2
                      accZ *= 2
                    }

                  }
                }
              })
              .catch(alert)
          }
        }
      })
      .catch(alert)
  }
}

// project a 3d vertex into 2d using simple pinhole camera model
function vertex3d(x, y, z, rx, ry, rz, dx, dy, dz, f) {
  let T = MULT([1, 0, 0, dx, 0, 1, 0, dy, 0, 0, 1, dz, 0, 0, 0, 1], MULT(ROTY(ry), MULT(ROTX(rx), ROTZ(rz))))
  return PROJ(f, TRFM(T, [x, y, z]))
}


function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
}

// visualize accelerometer data
function drawAcc(color, accX, accY, accZ) {

  push()
  noFill()
  strokeWeight(2)
  stroke(...color)

  let ang = Math.atan2(-accY, accX)
  let len = Math.hypot(accX, -accY) * 10
  push()

  rotate(ang)
  line(0, 0, len, 0)
  noStroke()
  fill(...color)
  if (len > 4) {
    triangle(len - 4, -4, len + 4, 0, len - 4, 4)
  }
  pop()
  fill(0)
  stroke(...color)
  circle(0, 0, accZ * 2 + 4)
  fill(...color)
  if (accZ > 0) {
    circle(0, 0, accZ / 2)
  } else {
    line(-accZ / 2, -accZ / 2, accZ / 2, accZ / 2)
    line(accZ / 2, -accZ / 2, -accZ / 2, accZ / 2)
  }
  pop()

}

// visualize gyroscope data
function drawRot(color, rotX, rotY, rotZ) {

  push()

  noFill()
  strokeWeight(2)
  stroke(...color)

  var cam = [-rotX, -rotY, -rotZ, 0, 0, 20, 100]

  let [va, vb, vc, vd, ve, vf, vg, vh] = [
    vertex3d(-8, -8, -8, ...cam),
    vertex3d(8, -8, -8, ...cam),
    vertex3d(8, 8, -8, ...cam),
    vertex3d(-8, 8, -8, ...cam),

    vertex3d(-8, -8, 8, ...cam),
    vertex3d(8, -8, 8, ...cam),
    vertex3d(8, 8, 8, ...cam),
    vertex3d(-8, 8, 8, ...cam),
  ]
  line(...va, ...vb)
  line(...vb, ...vc)
  line(...vc, ...vd)
  line(...vd, ...va)

  line(...ve, ...vf)
  line(...vf, ...vg)
  line(...vg, ...vh)
  line(...vh, ...ve)

  line(...va, ...ve)
  line(...vb, ...vf)
  line(...vc, ...vg)
  line(...vd, ...vh)
  pop()

}



function draw() {
  background(0)

  if (!hasSensorPermission) {
    textSize(18)
    background(0)
    fill(255)
    noStroke()
    textAlign(CENTER)
    text("Tap the screen\nto request sensor permissions...", width / 2, height / 2)
    return
  }

  rotX = radians([-rotationY, -rotationX, rotationY][~~(window.orientation / 90) + 1])
  rotY = radians([-rotationX, rotationY, rotationX][~~(window.orientation / 90) + 1])
  rotZ = radians(rotationZ)

  // in iOS 13, p5.js's accelerationX/Y/Z are constantly zero (because they don't properly use iOS 13's API)
  // if that's the case, apply my patch
  accX = accelerationX || accX
  accY = accelerationY || accY
  accZ = accelerationZ || accZ

  if (width > height) {
    ;[accX, accY] = [accY, accX]
  }

  // ============================
  // visualizing

  // draw what p5 gives in RED
  // draw patched result in CYAN

  push()
  translate(width / 4, height / 4)
  drawAcc([255, 0, 0], accelerationX, accelerationY, accelerationZ)
  pop()

  push()
  translate(width * 3 / 4, height / 4)
  drawRot([255, 0, 0], radians(rotationX), radians(rotationY), radians(rotationZ))
  pop()


  push()
  translate(width / 4, height * 3 / 4)
  drawAcc([0, 255, 255], accX, accY, accZ)
  pop()

  push()
  translate(width * 3 / 4, height * 3 / 4)
  drawRot([0, 255, 255], rotX, rotY, rotZ)
  pop()

  noStroke()
  textSize(20)
  textAlign(LEFT)
  fill(255, 0, 0)
  text("p5 current", 4, 20)

  fill(0, 255, 255)
  text("fixed", 4, height / 2 + 20)
}

function touchStarted() {
  return false
}
function touchMoved() {
  return false
}

function touchEnded() {
  if (!hasSensorPermission) {
    begPermission()
  }
  return false
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}