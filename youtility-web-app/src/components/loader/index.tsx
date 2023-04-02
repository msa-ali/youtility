import { MagnifyingGlass } from "react-loader-spinner"

function Loader() {
  return (
    <MagnifyingGlass
      visible={true}
      height="80"
      width="80"
      ariaLabel="MagnifyingGlass-loading"
      wrapperStyle={{}}
      wrapperClass="MagnifyingGlass-wrapper"
      glassColor='#c0efff'
      color='#e15b64'
    />
  )
}

export default Loader