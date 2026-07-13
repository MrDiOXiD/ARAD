
import Script from "next/script";

export default function Goftino() {
  return (
    <Script id="goftino" strategy="afterInteractive">
      {`
        (function(){
          var i="9MrTHP",
              d=document,
              g=d.createElement("script"),
              s="https://www.goftino.com/widget/"+i,
              l=localStorage.getItem("goftino_"+i);
          g.type="text/javascript";
          g.async=true;
          g.src=l ? s+"?o="+l : s;
          d.getElementsByTagName("head")[0].appendChild(g);
        })();
      `}
    </Script>
  );
}