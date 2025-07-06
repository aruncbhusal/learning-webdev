import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { opend } from "../../../declarations/opend";
import Item from "./Item";

// To test this, the example nfts are given in the course as well, I'll import them into the root folder as img_assets

function Minter() {
  // In order to work with the form, we will make use of the useForm hook, which is not native React so we import it
  const { register, handleSubmit } = useForm();
  const [principal, setPrincipal] = useState("");
  const [isLoaderHidden, setLoaderHidden] = useState(true);
  // In order to use it, we don't use the react controlled components approach but instead include an object in the element
  // We need to give the register form arguments for name of the input, as well as options, in our case 'required'
  // Now we can call the sequences after submission using the onClick attribute on the button for Mint NFT

  async function onSubmit(data) {
    // Let's show the loader on submit
    setLoaderHidden(false);

    // The handleSubmit function calls onSubmit with an argument, which we'll call data
    // Let's first get everything from the form, we need to create a UInt8Array for the image to be [Nat8] type
    const name = data.name;
    const image = data.image[0]; // Need to index because we get a filelist when files are uploaded
    // Now we need to condition the image file to be in the format of UInt8Array
    const imageByteData = [...new Uint8Array(await image.arrayBuffer())];
    // The arrayBuffer method turns the image object(blob) into an array buffer which can then be converted into UInt8Array
    // Finally we spread the elements of the array into a supported format (vanilla JS arrays) using spread operator
    // Now that we have the data here, we need to work with the main.mo file to add minting functionality

    // Finally let's get the opend declarations here and start working with the interface there
    const newNFTID = await opend.mint(imageByteData, name);
    // Now next we need to set a hook for the principal of this new ID
    console.log(newNFTID.toText());
    setPrincipal(newNFTID);

    setLoaderHidden(true);
  }

  // We display the form if the principal is empty, else we display the minted nft
  // When the form is submitted, we need to display a loader so we know it is being worked on
  // The loader html is also in the Readme file. I simply need to copy it.
  if (principal === "") {
    return (
      <div className="minter-container">
        <div hidden={isLoaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <div className="upload-container">
            <input
              {...register("image", { required: true })}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">Mint NFT</span>
          </div>
        </form>
      </div>
    );
  } else {
    // The else section is given in the readme
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item canisterID={principal} />
        </div>
      </div>
    );
  }
}

export default Minter;
