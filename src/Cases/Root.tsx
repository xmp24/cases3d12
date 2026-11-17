import React from "react";
import { Composition } from "remotion";
import { S1, S1_FRAMES } from "./S1";
import { S2, S2_FRAMES } from "./S2";
import { S3, S3_FRAMES } from "./S3";
export const CasesRoot: React.FC = () => <>
  <Composition id="CS1" component={S1} durationInFrames={S1_FRAMES} fps={60} width={1080} height={1920} defaultProps={{ audio: false }} />
  <Composition id="CS1A" component={S1} durationInFrames={S1_FRAMES} fps={60} width={1080} height={1920} defaultProps={{ audio: true }} />
  <Composition id="CS2" component={S2} durationInFrames={S2_FRAMES} fps={60} width={1080} height={1920} defaultProps={{ audio: false }} />
  <Composition id="CS2A" component={S2} durationInFrames={S2_FRAMES} fps={60} width={1080} height={1920} defaultProps={{ audio: true }} />
  <Composition id="CS3" component={S3} durationInFrames={S3_FRAMES} fps={60} width={1080} height={1920} defaultProps={{ audio: false }} />
  <Composition id="CS3A" component={S3} durationInFrames={S3_FRAMES} fps={60} width={1080} height={1920} defaultProps={{ audio: true }} />
</>;
