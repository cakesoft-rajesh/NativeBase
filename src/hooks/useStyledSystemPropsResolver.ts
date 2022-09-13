/* eslint-disable react-hooks/exhaustive-deps */
import { propConfig } from '../theme/styled-system';
import { useTheme } from './useTheme';
import React from 'react';
import { useNativeBaseConfig } from '../core/NativeBaseContext';
import { useResponsiveQuery } from '../utils/useResponsiveQuery';
//@ts-ignore
import stableHash from 'stable-hash';
import { resolvePropsToStyle } from './useThemeProps/propsFlattener';
import { Platform } from 'react-native';
import { omitUndefined } from '../theme/tools';

const getStyledSystemPropsAndRestProps = (props: any) => {
  const styledSystemProps: any = {};
  const restProps: any = {};

  const incomingAndThemeProps = omitUndefined(props);

  for (const key in incomingAndThemeProps) {
    if (key in propConfig) {
      styledSystemProps[key] = incomingAndThemeProps[key];
    } else {
      restProps[key] = incomingAndThemeProps[key];
    }
  }

  return { styledSystemProps, restProps };
};

export const useStyledSystemPropsResolver = ({
  style: propStyle,
  debug,
  ...props
}: any) => {
  // console.time("PROP_CONFIG");

  const theme = useTheme();

  const { currentBreakpoint, config } = useNativeBaseConfig(
    'makeStyledComponent'
  );
  const strictMode = config.strictMode;

  const { getResponsiveStyles } = useResponsiveQuery();
  // console.timeEnd("PROP_CONFIG");

  const { styledSystemProps, restProps } = getStyledSystemPropsAndRestProps(
    props
  );

  // console.log('** use prop resolution ***', props, getResponsiveStyles);

  // console.log('useStyledSystemPropsResolver', restProps);

  // if (props.bg === 'blue.500') {
  //   console.log(props.stateProps, 'hello here');
  // }

  const { style, dataSet } = React.useMemo(() => {
    const resolvedStyle = resolvePropsToStyle(
      styledSystemProps,
      propStyle,
      theme,
      Platform.OS,
      debug,
      currentBreakpoint,
      strictMode,
      getResponsiveStyles,
      restProps.INTERNAL_themeStyle,
      restProps.stateProps
    );

    // console.log(
    //   StyleSheet.flatten(resolvedStyle.style),
    //   styledSystemProps,
    //   '******'
    // );

    return resolvedStyle;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stableHash(styledSystemProps),
    theme,
    currentBreakpoint,
    debug,
    strictMode,
    stableHash(propStyle),
    getResponsiveStyles,
    stableHash(props),
    stableHash(restProps.stateProps),
  ]);

  // if (process.env.NODE_ENV === "development" && debug) {
  //   /* eslint-disable-next-line */
  //   console.log("style,resprops", currentBreakpoint);
  // }
  // console.log('** use prop resolution 2', restProps);

  delete restProps.INTERNAL_themeStyle;
  restProps.dataSet = { ...restProps.dataSet, ...dataSet };

  return [style, restProps];
};
