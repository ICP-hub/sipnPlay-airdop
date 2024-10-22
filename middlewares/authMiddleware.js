const CryptoJS = require("crypto-js");

const approvedPrincipals = [
  "oxj2h-r6fbj-hqtcn-fv7ye-yneeb-ca3se-c6s42-imvp7-juu33-ovnix-mae", //Paras
  "42l52-e6bwv-2353f-idnxh-5f42y-catp6-j2yxn-msivr-ljpu2-ifqsy-dqe", //Ankur
  "n5ytn-hebsc-fbio3-ll5ed-ermti-6kvdk-sjp4d-pofnb-66xhd-gpj4t-3qe", //Tushar Jain's Plug
  "hc4gt-vtazq-2beqs-7lv5p-4nezq-wl3hs-fojqx-2iwtc-mpxx6-ggswf-7ae", //Tushar Jain's ii
  "myjdw-wngdd-bzyo5-qjwgx-d3flt-pijev-3kjub-o6min-lzsty-hnhqf-mae",
  // "2nh3q-od732-potbk-gs2yh-nkqyt-i4xtt-fs73b-iirbu-ows4f-glqf5-qae", // Somiya Behera
];

const authenticatePrincipal = (req, res, next) => {
  const encryptedPrincipal = req.headers["x-principal"];
  console.log(req.headers);
  if (!encryptedPrincipal) {
    return res.status(401).json({ message: "Missing principal header" });
  }

  try {
    // Decrypt the principal using CryptoJS
    const bytes = CryptoJS.AES.decrypt(
      encryptedPrincipal,
      process.env.ENCRYPTION_KEY
    );
    const decryptedPrincipal = bytes.toString(CryptoJS.enc.Utf8);
    console.log(decryptedPrincipal);

    const isApproved = approvedPrincipals.includes(decryptedPrincipal);
    console.log(isApproved);
    if (!isApproved) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Principal is approved, proceed to the next middleware or route handler
    req.user = { principal: decryptedPrincipal }; // Attach the principal to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid principal" });
  }
};

module.exports = authenticatePrincipal;
