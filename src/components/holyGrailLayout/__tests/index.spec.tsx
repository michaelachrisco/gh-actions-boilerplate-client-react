import { render, screen, cleanup } from '@testing-library/react';
import { Footer } from '../../footer/index';
import { HolyGrailLayout } from '../index';

let HolyGrailWrapper: HTMLElement;
let HolyGrailMainWrapper: HTMLElement;
let HolyGrailLeftAside: HTMLElement;
let HolyGrailMain: HTMLElement;
let HolyGrailRightAside: HTMLElement;

afterEach(cleanup);

describe('holyGrailLayout', () => {
  screen.debug();
  it('Should display when props are not present', () => {
    render(HolyGrail);
    expect(<HolyGrailLayout />).toBeVisible();
  });
  it('Should display when all props are present', () => {
    const { rerender } = render(HolyGrail);
    rerender(<HolyGrailLayout leftSidebar={<div />} rightSidebar={<div />} footer={Footer} />);
    expect(<HolyGrailLayout />).toBeInTheDocument();
  });
  describe('wrappers', () => {
    it('Should render the HolyGrailWrapper', () => {
      render(HolyGrail);
      expect(<HolyGrailWrapper />).toBeInTheDocument();
    });
    it('Should render the HolyGrailMainWrapper', () => {
      render(HolyGrail);
      expect(<HolyGrailMainWrapper />).toBeInTheDocument();
    });
  });
  describe('leftSideBar', () => {
    it('Should render the leftAside when the leftSidebar prop is present', () => {
      const { rerender } = render(HolyGrail);
      rerender(<HolyGrailLayout leftSidebar={<div />} />);
      expect(<HolyGrailLeftAside />).toBeInTheDocument();
    });
    it('Should not render the leftAside when the leftSidebar prop is not present', () => {
      render(HolyGrail);
      expect(<HolyGrailLeftAside />).not.toBeInTheDocument();
    });
  });
  describe('rightSideBar', () => {
    it('Should render the rightAside when the rightSidebar prop is present', () => {
      const { rerender } = render(HolyGrail);
      rerender(<HolyGrailLayout rightSidebar={<div />} />);
      expect(<HolyGrailRightAside />).toBeInTheDocument();
    });
    it('Should not render the rightAside when the rightSidebar prop is not present', () => {
      render(HolyGrail);
      expect(<HolyGrailRightAside />).not.toBeInTheDocument();
    });
    describe('footer', () => {
      it('Should render footer if footer prop is present', () => {
        const { rerender } = render(HolyGrail);
        rerender(<HolyGrailLayout footer={Footer} />);
        expect(<Footer />).toBeInTheDocument();
      });
      it('Should not render the footer when the footer prop is not present', () => {
        render(HolyGrail);
        expect(<Footer />).not.toBeInTheDocument();
      });
    });
    describe('children', () => {
      it('Should render HolyGrailMain component when children are present', () => {
        const { rerender } = render(HolyGrail);
        rerender(
          <HolyGrailLayout>
            <div />
          </HolyGrailLayout>,
        );
        expect(<HolyGrailMain />).toBeInTheDocument();
      });
      it('Should not render HolyGrailMain component when children are not present', () => {
        render(HolyGrail);
        expect(<HolyGrailMain />).not.toBeInTheDocument();
      });
    });
  });
});
