import { ContainerScroll } from "../ui/container-scroll-animation";
import { AuroraText } from "../../components/magicui/aurora-text";
import Show from "./sual.png";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-2xl md:text-[5rem] font-semibold mt-1 leading-none">
              MediaSync <br />
              <span className="text-5xl font-semibold text-black dark:text-white">
                Communication{" "}
                <AuroraText
                  className="text-5xl font-semibold text-black dark:text-white inline"
                  colors={["#FF0080", "#7928CA", "#0070F3", "#38bdf8"]}
                  speed={2}
                >
                  Reimagined
                </AuroraText>
              </span>
            </h1>
          </>
        }
      >
        <img
          src={Show}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}