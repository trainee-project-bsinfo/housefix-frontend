export const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <img src="/404.png" style={{marginTop: "50px", width: "40vw", height: "40vh"}} />
      <h2>Seite nicht gefunden</h2>
    </div>
  );
};
