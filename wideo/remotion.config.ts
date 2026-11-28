import { Config } from '@remotion/cli/config'

// Plansze, sceny i (później) lektor leżą przy scenariuszach w docs/youtube/<film>/
Config.setPublicDir('../docs/youtube')
Config.setVideoImageFormat('png')
Config.setCrf(18)
