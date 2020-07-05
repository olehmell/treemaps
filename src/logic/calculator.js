// Understanding of names of the variables can be drawn from
// https://protw.github.io/treemap/#Математика%20сферичного%20трикутника
// Prefixes: 
//     'lat' - latitude, 'long' - longitude, 'az' - azimuth (heading),
//     'a', 'b', 'c' - sides of spherical triangle, 
//     'A', 'B', 'C' - angles (and vertixes) of spherical triangle.
// Suffixes:
//     '_r' - in radian, '_d' - in degree, '_m' - in m.
// Examples:
//     'longC_d' - longitude of vertix 'C' in degree,
//     'azCA_d'  - azimuth of interval 'CA' (i.e. from 'C' to 'A') in degree
//     'B_r'     - angle 'B' of triangle in radian
//     'a_r'     - side 'a' ('BC' opposite to vertex 'A') of triangle in radian
// Test input / output data are included
//
// List of functions used:
//    treemap_calculator(in_dat)
//    deg2rad(a)
//    rad2deg(a)
//    swap_views(in_dat)

//  TEST INPUT DATA
let in_dat = {
  latC_d:  5.045522769157693e+01,
  longC_d: 3.052105291359867e+01,
  azCA_d:  5.044651145190480e+01,
  latB_d:  5.045524946122595e+01,
  longB_d: 3.052194964240277e+01,
  azBA_d:  3.486708402941242e+02
};
  
//  REFERENT OCTAVE OUTPUT RESULT
let out_dat_octav = {
  lat_A_d:  5.045563536761307e+01,
  long_A_d: 3.052182821294145e+01,
  a_r:      9.971849945481075e-06,
  b_r:      1.117360728745645e-05,
  c_r:      6.869168970035038e-06
};

// CHECK SWAP VIEW WINDOWS
// In order to check - uncomment the next line
//in_dat = swap_views(in_dat);

// CALCULATION
let out_dat = treemap_calculator(in_dat);

var Earth_R_m = 6371000; // Radius of the Earth in m
let a_m = out_dat.a_r*Earth_R_m;
let c_m = out_dat.c_r*Earth_R_m;
let b_m = out_dat.b_r*Earth_R_m;

// RESULT OUTPUT
console.log('IN_DAT:');
console.log(in_dat);

console.log('OUT_DAT and RELATIVE DEVIATION:');
for (let prop in out_dat) {
  let rel_dev = (out_dat[prop] - out_dat_octav[prop]) / (out_dat[prop] + out_dat_octav[prop]) * 2.0;
  console.log(`Property '${prop}' = ${out_dat[prop]}, rel. dev. = ${rel_dev}`);
}
console.log(`Sides of triangle, m: 'a_m' = ${a_m}, 'b_m' = ${b_m}, 'c_m' = ${c_m}`)

// FUNCTIONS:
//    treemap_calculator(in_dat)
//    deg2rad(a)
//    rad2deg(a)
//    swap_views(in_dat)

export function treemap_calculator(in_dat) {
  let latC_d = in_dat.latC_d, longC_d = in_dat.longC_d, azCA_d = in_dat.azCA_d, 
      latB_d = in_dat.latB_d, longB_d = in_dat.longB_d, azBA_d = in_dat.azBA_d;

  let latC_r  = deg2rad(latC_d), longC_r = deg2rad(longC_d), 
      latB_r  = deg2rad(latB_d), longB_r = deg2rad(longB_d);
  
  let dlat_r = longB_r - longC_r;
    
  let a_r = Math.acos(Math.sin(latB_r)*Math.sin(latC_r) + Math.cos(latB_r)*Math.cos(latC_r)*Math.cos(dlat_r));
  let azCB_r = Math.atan2(Math.sin(dlat_r), Math.cos(latC_r)*Math.tan(latB_r) - Math.sin(latC_r)*Math.cos(dlat_r));
  azCB_r = azCB_r % (2*Math.PI);
  let azCB_d = rad2deg(azCB_r);

  let B_r = deg2rad(180 - (azCB_d - azBA_d));
  let C_r = deg2rad(azCB_d - azCA_d);

  let A_r = Math.acos(-Math.cos(B_r)*Math.cos(C_r) + Math.sin(B_r)*Math.sin(C_r)*Math.cos(a_r));
  let b_r = Math.asin(Math.sin(a_r)/Math.sin(A_r)*Math.sin(B_r));
  let c_r = Math.asin(Math.sin(a_r)/Math.sin(A_r)*Math.sin(C_r));

  let azCA_r = deg2rad(azCA_d);
  let lat_A_r = Math.PI/2 - Math.acos(Math.sin(latC_r)*Math.cos(b_r) + Math.cos(latC_r)*Math.sin(b_r)*Math.cos(azCA_r));

  let cos_gamma = (Math.cos(b_r) - Math.sin(lat_A_r)*Math.sin(latC_r))/(Math.cos(lat_A_r)*Math.cos(latC_r));
  let sin_gamma = Math.sin(azCA_r)*Math.sin(b_r)/Math.cos(lat_A_r);
  let gamma = Math.atan2(sin_gamma, cos_gamma);

  let long_A_r = longC_r + gamma;
  long_A_r = long_A_r + Math.PI % (2*Math.PI) - Math.PI;

  let lat_A_d = rad2deg(lat_A_r);
  let long_A_d = rad2deg(long_A_r);

  let out_dat = {
    lat_A_d:  lat_A_d, 
    long_A_d: long_A_d, 
    a_r:      a_r, 
    b_r:      b_r, 
    c_r:      c_r
  };
  if (out_dat.b_r < 0 || out_dat.c_r < 0) {
    //console.log('Swap left and right observation views')
    out_dat = treemap_calculator(swap_views(in_dat));
  }
  return out_dat;
}

export function deg2rad(a) {
  return a/180*Math.PI;
}

export function rad2deg(a) {
  return a*180/Math.PI;
}

function swap_views (in_dat) {
  return {
    latC_d:  in_dat.latB_d,
    longC_d: in_dat.longB_d,
    azCA_d:  in_dat.azBA_d,
    latB_d:  in_dat.latC_d,
    longB_d: in_dat.longC_d,
    azBA_d:  in_dat.azCA_d
};

}
