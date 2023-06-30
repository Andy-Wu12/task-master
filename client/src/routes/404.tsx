
export default function NotFound() {

  return (
    <div>
      <h1> W-What are you doing here? (ERROR 404) </h1>
      <h2> The URL you entered does not exist </h2>
      <video width="90%" style={{maxHeight: "80vh"}} autoPlay loop muted>
        <source src='https://awu-media-bucket.s3.amazonaws.com/404_Video.mp4' type="video/mp4" />
        Your browser does not support videos!
      </video>

    </div>
  )
}